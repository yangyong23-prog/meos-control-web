import fs from 'fs';
import XLSX from "xlsx";
import _ from 'lodash';
import path from 'path';
const workbook = XLSX.utils.book_new();
const zhmap = {}; // 中文配置
const result = [];
function getJsFileBasename(filename) {
  var i = filename.lastIndexOf('.');
  if (i < 0) i = filename.length;
  var basename = filename.substr(i+1);

  if(basename === '') {
    return false;
  } else {
    return basename;
  }
};

const translateFile = async (filepath) => {
  const basename = getJsFileBasename(filepath)
  let replaced = false;
  let matched = false;
  let already = false;

  // vue文件的修改
  if(basename === 'vue'){
    let data = await fs.readFileSync(filepath,
      { encoding: 'utf-8'});
    // 有i18n的内容
    if(data.match(/[\u4e00-\u9fa5]+/gi) ||
      data.match(/i18n/gi)
    ){
      matched = true;
      // 没有import方法
      if(!data.match(/import\s+i18n\s+from/gi)){
        if(
          data.match(/\<script setup\>/gi)
        ){
          replaced = true;
          data = data.replace('<script setup>\n', "<script setup>\nimport i18n from '@/localization';\n")
        }else if(
          data.match(/\<script lang\=\"ts\" setup\>/gi)
        ){
          replaced = true;
          data = data.replace('<script lang="ts" setup>\n', `<script lang="ts" setup>\n// @ts-ignore\nimport i18n from '@/localization';\n`)
        }else if(
          data.match(/\<script lang\=\"js\" setup\>/gi)
        ){
          replaced = true;
          data = data.replace('<script lang="js" setup>\n', `<script lang="js" setup>\nimport i18n from '@/localization';\n`)
        }else if( 
          data.match(/\<script setup lang\=\"jsx\"\>/gi)
        ){
          replaced = true;
          data = data.replace('<script setup lang="jsx">\n', `<script setup lang="jsx">\nimport i18n from '@/localization';\n`)
        }else if(
          data.match(/\<script setup lang\=\"ts\"\>/gi)
        ){
          replaced = true;
          data = data.replace('<script setup lang="ts">\n', `<script setup lang="ts">\n// @ts-ignore\nimport i18n from '@/localization';\n`)
        }
      }else{
        already = true;
      }
    }
    result.push({
      文件位置: filepath,
      有i18n字符: matched ? '是' : '否',
      是否替换: replaced ? '是' : '否',
      是否已有: already ? '是' : '否'
    })
    await fs.writeFileSync(filepath, data,
        { encoding: 'utf-8'});
  } else if(basename === 'js'){
    let data = await fs.readFileSync(filepath,
      { encoding: 'utf-8'});

    // 有i18n的内容
    if(data.match(/[\u4e00-\u9fa5]+/gi) ||
      data.match(/i18n/gi)
    ){
      matched = true;
      // 没有import方法
      if(!data.match(/import\si18n\sfrom/gi)){
        replaced = true;
        data = "import i18n from '@/localization';\n" + data;
      }else{
         already = true;
      }
    }
    result.push({
      文件位置: filepath,
      有i18n字符: matched ? '是' : '否',
      是否替换: replaced ? '是' : '否',
      是否已有: already ? '是' : '否'
    })
    await fs.writeFileSync(filepath, data,
        { encoding: 'utf-8'});
  }else if(basename === 'ts'){
    let data = await fs.readFileSync(filepath,
      { encoding: 'utf-8'});

    // 有i18n的内容
    if(data.match(/[\u4e00-\u9fa5]+/gi) ||
      data.match(/i18n/gi)
    ){
      matched = true;
      // 没有import方法
      if(!data.match(/import\si18n\sfrom/gi)){
        data = "// @ts-ignore\nimport i18n from '@/localization';\n" + data;
      } else {
        already = true;
      }
    }
    result.push({
      文件位置: filepath,
      有i18n字符: matched ? '是' : '否',
      是否替换: replaced ? '是' : '否',
      是否已有: already ? '是' : '否'
    })
    await fs.writeFileSync(filepath, data,
        { encoding: 'utf-8'});
  }
} 
const scanDir = async(dir) => {
  const files = fs.readdirSync(dir, {
    withFileTypes: true
  });
  // 如果是assets, mokes, api, test文件夹下的文件，不扫描
  // 如果有其他文件夹要添加可以手动添加
  if (
      dir.match(/src\/assets/gi) ||
      dir.match(/src\/mocks/gi) ||
       dir.match(/src\/apis/gi) ||
      dir.match(/src\/api\/assetService/gi) ||
      dir.match(/mock\.js$/gi) ||
      dir.match(/src\/views\/GraphMVC/gi) ||
      dir.match(/src\/router/gi) ||
      dir.match(/src\/demo/gi) ||
      dir.match(/src\/views\/machine-room-safety\/floor-map\/constant/gi) ||
      dir.match(/src\/views\/test/gi)
  ) {
      return;
  }
  for(let file of files) {
    // 如果是assets, api, mock.js, templatescene.js, mockdata.js, firecontrl.js, test文件，不扫描
    // 后续如果有其他文件要过滤，可以手动添加
    if (
        file.name.match(/src\/assets/gi) ||
        file.name.match(/src\/locale/gi) ||
        file.name.match(/src\/api\/assetService/gi) ||
        file.name.match(/mock\.js$/gi) ||
        file.name.match(/src\/router/gi) ||
        file.name.match(/src\/demo/gi) ||
        file.name.match(/src\/views\/machine-room-safety\/floor-map\/constant/gi) ||
        file.name.match(/templatescene\.js$/gi) ||
        file.name.match(/mockdata\.js$/gi) ||
        file.name.match(/videoPlayer\.js/gi) ||
        file.name.match(/firecontrol\.js$/gi) ||
        file.name.match(/src\/views\/test/gi)
    ) {
        continue;
    }
    const p = path.join(dir, file.name);
    const basename = getJsFileBasename(file.name)
    if(file.isFile()){
      if(
        !['jpg', 'jpeg', 'png', 'less', 'json', 'gif', 'svg', 'md', 'wasm'].includes(basename) &&
        !file.name.match(/min\.js$/gi) // 如果是编译过的min.js文件，不扫描
      ){
        translateFile(p)
      }
    }else if(file.isDirectory()){
      await scanDir(p);
    }
  }
}

async function main() {
  const dir = process.argv[process.argv.length - 1];
  // console.log(zhLocale);
  if(dir){
    await scanDir(dir)
    const worksheet =  XLSX.utils.json_to_sheet(result);
    XLSX.utils.book_append_sheet(workbook, worksheet, "sheet1");
    await XLSX.writeFileSync(workbook, path.join(`./failed/添加i18n的结果${new Date().getTime()}.xlsx`), {});
  }else{
    console.error('缺少相对路径 例：npm run translate ./src/views')
  }
}

main()