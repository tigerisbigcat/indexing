let excelData = null; // 用来存储Excel数据

// 尝试从 LocalStorage 中加载缓存的 Excel 数据
const cachedExcelData = localStorage.getItem("excelData");
if (cachedExcelData) {
  excelData = JSON.parse(cachedExcelData);
  document.getElementById("results").innerHTML =
    "已加载缓存数据，请输入塔罗牌名称进行搜索。";
}

// 监听文件上传
document
  .getElementById("fileInput")
  .addEventListener("change", function (event) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0]; // 获取第一个 sheet
      const sheet = workbook.Sheets[sheetName];
      excelData = XLSX.utils.sheet_to_json(sheet); // 将 Excel 转换为 JSON

      // 缓存到 LocalStorage 中
      localStorage.setItem("excelData", JSON.stringify(excelData));

      console.log(excelData); // 调试输出
      document.getElementById("results").innerHTML =
        "数据加载完成，请输入塔罗牌名称进行搜索。";
    };
    reader.readAsArrayBuffer(event.target.files[0]);
  });

// 监听输入框回车事件
document
  .getElementById("searchInput")
  .addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      const searchValue = event.target.value.trim();
      const outputDiv = document.getElementById("results");
      outputDiv.innerHTML = ""; // 清空上次的搜索结果

      if (excelData) {
        const keywords = searchValue
          .split("，")
          .map((keyword) => keyword.trim()); // 支持多个关键词
        let foundAny = false;

        keywords.forEach((keyword) => {
          const result = excelData.find((row) => row["塔罗牌名称"] === keyword);
          if (result) {
            outputDiv.innerHTML += `<div class="result-block"><h3>${result["塔罗牌名称"]}</h3><p>${result["解读内容"]}</p></div>`;
            foundAny = true;
          } else {
            outputDiv.innerHTML += `<div class="result-block">未找到对应的塔罗牌: ${keyword}</div>`;
          }
        });

        if (!foundAny) {
          outputDiv.innerHTML = `未找到相关塔罗牌: ${searchValue}`;
        }
      } else {
        outputDiv.innerHTML = "请先上传塔罗牌文件或等待数据加载完成。";
      }
    }
  });
