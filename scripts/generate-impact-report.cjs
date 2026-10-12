#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('node:fs');
const path = require('node:path');
const { execSync } = require('node:child_process');

function run(command) {
    try {
        return execSync(command, {
            encoding: 'utf8',
            stdio: ['pipe', 'pipe', 'ignore']
        }).trim();
    } catch (error) {
        return '';
    }
}

function normalizePath(filePath) {
    return filePath.replace(/\\/g, '/');
}

function parseArgs() {
    const args = process.argv.slice(2);
    const isStaged = args.includes('--staged');
    const rangeArg = args.find(arg => arg && !arg.startsWith('--'));
    return {
        isStaged,
        rangeArg: rangeArg ? rangeArg.trim() : ''
    };
}

function getRangeFromArgsOrUpstream(rangeArg) {
    const fromArg = rangeArg;
    if (fromArg) {
        return fromArg;
    }

    const upstream = run('git rev-parse --abbrev-ref --symbolic-full-name @{upstream}');
    if (upstream) {
        return `${upstream}...HEAD`;
    }

    const hasHeadPrev = run('git rev-parse --verify HEAD~1');
    if (hasHeadPrev) {
        return 'HEAD~1...HEAD';
    }

    return 'HEAD';
}

function getChangedFiles(range, isStaged) {
    if (isStaged) {
        const output = run('git diff --cached --name-only --diff-filter=ACMR');
        return output ? output.split('\n').map(normalizePath).filter(Boolean) : [];
    }

    if (range === 'HEAD') {
        const singleCommitFiles = run('git show --pretty="" --name-only --diff-filter=ACMR HEAD');
        return singleCommitFiles ? singleCommitFiles.split('\n').map(normalizePath).filter(Boolean) : [];
    }

    const output = run(`git diff --name-only --diff-filter=ACMR ${range}`);
    return output ? output.split('\n').map(normalizePath).filter(Boolean) : [];
}

function isCodeFile(filePath) {
    return /\.(vue|ts|tsx|js|jsx|mjs|cjs|json|less|scss|sass|css)$/i.test(filePath);
}

const RESOLVE_EXTS = ['.ts', '.tsx', '.js', '.jsx', '.vue', '.mjs', '.cjs', '.json'];

function cleanRelativePath(p) {
    return normalizePath(path.normalize(p)).replace(/^\.\//, '');
}

function extractImportSpecifiers(content) {
    const result = new Set();
    const patterns = [
        /import\s+(?:[\w*\s{},]*\s+from\s*)?["'`]([^"'`]+)["'`]/g,
        /export\s+(?:[\w*\s{},]*\s+from\s*)["'`]([^"'`]+)["'`]/g,
        /require\(\s*["'`]([^"'`]+)["'`]\s*\)/g,
        /import\(\s*["'`]([^"'`]+)["'`]\s*\)/g
    ];

    patterns.forEach(reg => {
        let match;
        while ((match = reg.exec(content)) !== null) {
            if (match[1]) {
                result.add(match[1].trim());
            }
        }
    });

    return Array.from(result);
}

function resolveWithExtensions(basePath, trackedSet) {
    const normalizedBase = cleanRelativePath(basePath);
    const ext = path.extname(normalizedBase);
    const candidates = new Set();

    candidates.add(normalizedBase);

    if (ext) {
        const noExt = normalizedBase.slice(0, -ext.length);
        candidates.add(noExt);
    } else {
        RESOLVE_EXTS.forEach(item => {
            candidates.add(`${normalizedBase}${item}`);
            candidates.add(`${normalizedBase}/index${item}`);
        });
        candidates.add(`${normalizedBase}/index`);
    }

    for (const file of candidates) {
        if (trackedSet.has(file)) {
            return file;
        }
    }

    return '';
}

function resolveSpecifierToFile(specifier, importerFile, trackedSet) {
    if (!specifier) {
        return '';
    }

    if (specifier.startsWith('@/')) {
        const aliasPath = `src/${specifier.slice(2)}`;
        return resolveWithExtensions(aliasPath, trackedSet);
    }

    if (specifier.startsWith('./') || specifier.startsWith('../')) {
        const based = cleanRelativePath(path.join(path.dirname(importerFile), specifier));
        return resolveWithExtensions(based, trackedSet);
    }

    return '';
}

function getRouteFiles(trackedFiles) {
    return trackedFiles.filter(file => /^src\/router\/.*\.(js|ts)$/i.test(file));
}

function buildRouteIndex(routeFiles, trackedSet) {
    const routeIndex = {};

    routeFiles.forEach(routeFile => {
        const fullPath = path.join(process.cwd(), routeFile);
        if (!fs.existsSync(fullPath)) {
            return;
        }

        let content = '';
        try {
            content = fs.readFileSync(fullPath, 'utf8');
        } catch (error) {
            return;
        }

        const pathReg = /\bpath\s*:\s*['"`]([^'"`]+)['"`]/g;
        for (let pathMatch = pathReg.exec(content); pathMatch !== null; pathMatch = pathReg.exec(content)) {
            const routePath = pathMatch[1]?.trim();
            if (!routePath) {
                continue;
            }

            // 从当前 path 向后截取一段，提取同一个路由对象中的 name/component/meta
            const snippet = content.slice(pathMatch.index, pathMatch.index + 1800);
            const componentMatch = snippet.match(/\bcomponent\s*:\s*\(\)\s*=>\s*import\(\s*['"`]([^'"`]+)['"`]\s*\)/);
            if (!componentMatch || !componentMatch[1]) {
                continue;
            }

            const routeNameMatch = snippet.match(/\bname\s*:\s*['"`]([^'"`]+)['"`]/);
            const metaNameMatch = snippet.match(/\bmeta\s*:\s*\{[\s\S]{0,500}?\b(?:name|title)\s*:\s*['"`]([^'"`]+)['"`]/);
            const componentFile = resolveSpecifierToFile(componentMatch[1].trim(), routeFile, trackedSet);
            if (!componentFile) {
                continue;
            }

            if (!routeIndex[componentFile]) {
                routeIndex[componentFile] = [];
            }

            const routeInfo = {
                routePath,
                routeName: (routeNameMatch?.[1] || '').trim(),
                routeTitle: (metaNameMatch?.[1] || '').trim()
            };
            const routeKey = `${routeInfo.routePath}|${routeInfo.routeName}|${routeInfo.routeTitle}`;
            const exists = routeIndex[componentFile].some(item => `${item.routePath}|${item.routeName}|${item.routeTitle}` === routeKey);
            if (!exists) {
                routeIndex[componentFile].push(routeInfo);
            }
        }
    });

    Object.keys(routeIndex).forEach(file => {
        routeIndex[file] = routeIndex[file].sort((a, b) => (a.routePath || '').localeCompare(b.routePath || '', 'zh-CN'));
    });

    return routeIndex;
}

function getViewRoot(filePath) {
    const normalized = normalizePath(filePath);
    const parts = normalized.split('/');
    if (parts.length >= 3 && parts[0] === 'src' && parts[1] === 'views') {
        return `src/views/${parts[2]}`;
    }
    return '';
}

function buildRouteOwnerIndex(routeIndex) {
    const routeOwnerIndex = {};
    Object.keys(routeIndex).forEach(componentFile => {
        const viewRoot = getViewRoot(componentFile);
        if (!viewRoot) {
            return;
        }
        if (!routeOwnerIndex[viewRoot]) {
            routeOwnerIndex[viewRoot] = [];
        }
        routeIndex[componentFile].forEach(routeInfo => {
            const routeKey = `${routeInfo.routePath}|${routeInfo.routeName}|${routeInfo.routeTitle}`;
            const exists = routeOwnerIndex[viewRoot].some(item => `${item.routePath}|${item.routeName}|${item.routeTitle}` === routeKey);
            if (!exists) {
                routeOwnerIndex[viewRoot].push(routeInfo);
            }
        });
    });

    Object.keys(routeOwnerIndex).forEach(root => {
        routeOwnerIndex[root] = routeOwnerIndex[root].sort((a, b) => (a.routePath || '').localeCompare(b.routePath || '', 'zh-CN'));
    });

    return routeOwnerIndex;
}

function unique(items) {
    return Array.from(new Set(items.filter(Boolean)));
}

function getRouteInfosForFile(filePath, routeIndex, routeOwnerIndex) {
    const direct = routeIndex[filePath] || [];
    if (direct.length) {
        return direct;
    }
    const viewRoot = getViewRoot(filePath);
    if (viewRoot && routeOwnerIndex[viewRoot]?.length) {
        return routeOwnerIndex[viewRoot];
    }
    return [];
}

function getFileDisplayName(filePath, routeIndex, routeOwnerIndex) {
    const routeInfos = getRouteInfosForFile(filePath, routeIndex, routeOwnerIndex);
    const routeNames = unique(routeInfos.map(route => route.routeTitle || route.routeName || route.routePath));
    if (routeNames.length) {
        return routeNames.join(' / ');
    }
    const ext = path.extname(filePath);
    return path.basename(filePath, ext || undefined);
}

function main() {
    const repoRoot = run('git rev-parse --show-toplevel');
    if (!repoRoot) {
        console.error('无法定位 Git 仓库根目录。');
        process.exit(1);
    }
    process.chdir(repoRoot);

    const { isStaged, rangeArg } = parseArgs();
    const range = getRangeFromArgsOrUpstream(rangeArg);
    const changedFiles = getChangedFiles(range, isStaged).filter(file => fs.existsSync(path.join(repoRoot, file)));

    const trackedFiles = run('git ls-files')
        .split('\n')
        .map(normalizePath)
        .filter(file => file && isCodeFile(file));
    const trackedSet = new Set(trackedFiles);
    const routeFiles = getRouteFiles(trackedFiles);
    const routeIndex = buildRouteIndex(routeFiles, trackedSet);
    const routeOwnerIndex = buildRouteOwnerIndex(routeIndex);

    const impactMap = {};
    const reverseIndex = {};

    trackedFiles.forEach(importer => {
        const importerFullPath = path.join(repoRoot, importer);
        if (!fs.existsSync(importerFullPath)) {
            return;
        }

        let content = '';
        try {
            content = fs.readFileSync(importerFullPath, 'utf8');
        } catch (error) {
            return;
        }

        const specifiers = extractImportSpecifiers(content);
        specifiers.forEach(specifier => {
            const resolved = resolveSpecifierToFile(specifier, importer, trackedSet);
            if (!resolved || resolved === importer) {
                return;
            }
            if (!reverseIndex[resolved]) {
                reverseIndex[resolved] = new Set();
            }
            reverseIndex[resolved].add(importer);
        });
    });

    changedFiles.forEach(changed => {
        const fullPath = path.join(repoRoot, changed);
        if (!isCodeFile(changed) || !fs.existsSync(fullPath)) {
            impactMap[changed] = [];
            return;
        }

        const impacted = Array.from(reverseIndex[changed] || []).sort((a, b) => a.localeCompare(b, 'zh-CN'));
        impactMap[changed] = impacted;
    });

    const now = new Date();
    const pad = n => String(n).padStart(2, '0');
    const stamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
    const reportDir = path.join(repoRoot, '.impact-reports');
    fs.mkdirSync(reportDir, { recursive: true });

    const lines = [];
    lines.push('# 变更影响分析报告（自动生成）');
    lines.push('');
    lines.push(`- 生成时间: ${now.toLocaleString('zh-CN', { hour12: false })}`);
    lines.push(`- 比较范围: \`${isStaged ? 'STAGED(--cached)' : range}\``);
    lines.push(`- 改动文件数: ${changedFiles.length}`);
    lines.push('');
    lines.push('> 说明：本报告基于静态 import/require 解析与路径解析，属于“可能影响”范围，请结合业务再确认。');
    lines.push('');

    if (isStaged) {
        lines.push('## 本次暂存文件清单（commit snapshot）');
        lines.push('');
        if (!changedFiles.length) {
            lines.push('- 暂存区当前无可分析改动文件。');
        } else {
            changedFiles.forEach(file => lines.push(`- \`${file}\``));
        }
        lines.push('');
    }

    if (!changedFiles.length) {
        lines.push('## 改动文件');
        lines.push('');
        lines.push('- 本次未检测到可分析的改动文件。');
    } else {
        lines.push('## 改动文件');
        lines.push('');
        changedFiles.forEach(file => lines.push(`- \`${file}\``));
        lines.push('');

        lines.push('## 可能受影响的使用文件');
        lines.push('');
        changedFiles.forEach(file => {
            const impacted = impactMap[file] || [];
            lines.push(`### \`${file}\``);
            lines.push('');
            if (!impacted.length) {
                lines.push('- 未扫描到直接引用（或为间接影响）。');
            } else {
                impacted.forEach(item => {
                    const itemName = getFileDisplayName(item, routeIndex, routeOwnerIndex);
                    lines.push(`- \`${item}\`（模块: ${itemName}）`);
                    const routeInfos = getRouteInfosForFile(item, routeIndex, routeOwnerIndex);
                    if (routeInfos.length) {
                        lines.push('  - 路由信息:');
                        routeInfos.forEach(route => {
                            const routeDisplay = route.routeTitle || route.routeName || route.routePath;
                            lines.push(`    - ${routeDisplay} (path: \`${route.routePath}\`${route.routeName ? `, name: \`${route.routeName}\`` : ''})`);
                        });
                    }
                    const secondLevelRefs = Array.from(reverseIndex[item] || [])
                        .filter(ref => ref !== file)
                        .sort((a, b) => a.localeCompare(b, 'zh-CN'));

                    if (!secondLevelRefs.length) {
                        lines.push('  - L2 引用: 未扫描到继续引用');
                    } else {
                        lines.push('  - L2 引用:');
                        secondLevelRefs.forEach(ref => {
                            const refName = getFileDisplayName(ref, routeIndex, routeOwnerIndex);
                            lines.push(`    - \`${ref}\`（模块: ${refName}）`);
                            const thirdLevelRefs = Array.from(reverseIndex[ref] || [])
                                .filter(third => third !== item && third !== file)
                                .sort((a, b) => a.localeCompare(b, 'zh-CN'));

                            if (!thirdLevelRefs.length) {
                                lines.push('      - L3 引用: 未扫描到继续引用');
                            } else {
                                lines.push('      - L3 引用:');
                                thirdLevelRefs.forEach(third => {
                                    const thirdName = getFileDisplayName(third, routeIndex, routeOwnerIndex);
                                    lines.push(`        - \`${third}\`（模块: ${thirdName}）`);
                                });
                            }
                        });
                    }
                });
            }
            lines.push('');
        });
    }

    const latestFile = path.join(reportDir, 'impact-latest.md');
    const historyFile = path.join(reportDir, `impact-${stamp}.md`);
    const content = lines.join('\n');

    fs.writeFileSync(latestFile, content, 'utf8');
    fs.writeFileSync(historyFile, content, 'utf8');

    const historyReports = fs
        .readdirSync(reportDir)
        .filter(file => /^impact-\d{8}-\d{6}\.md$/i.test(file))
        .sort((a, b) => a.localeCompare(b, 'zh-CN'));
    const maxHistoryCount = 10;
    while (historyReports.length > maxHistoryCount) {
        const oldest = historyReports.shift();
        if (!oldest) {
            break;
        }
        fs.unlinkSync(path.join(reportDir, oldest));
        console.log(`[impact-report] 已清理历史报告: ${normalizePath(path.join('.impact-reports', oldest))}`);
    }

    console.log(`[impact-report] 已生成: ${normalizePath(path.relative(repoRoot, latestFile))}`);
    console.log(`[impact-report] 已归档: ${normalizePath(path.relative(repoRoot, historyFile))}`);
}

main();
