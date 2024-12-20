let excelData = null; // 用来存储Excel数据

const githubExcelUrl = "https://tigerisbigcat.github.io/indexing/taluo.xlsx";

// 使用 fetch 请求从 GitHub 获取文件
fetch(githubExcelUrl)
  .then((response) => response.arrayBuffer()) // 将响应转换为 ArrayBuffer
  .then((data) => {
    const workbook = XLSX.read(new Uint8Array(data), { type: "array" });
    const sheetName = workbook.SheetNames[0]; // 获取第一个 sheet
    const sheet = workbook.Sheets[sheetName];
    excelData = XLSX.utils.sheet_to_json(sheet); // 将表格数据转换为 JSON
    console.log(excelData); // 调试输出
    document.getElementById("results").innerHTML =
      "数据加载完成，请输入塔罗牌名称进行搜索。";
  })
  .catch((error) => {
    console.error("加载 Excel 文件时出错:", error);
    document.getElementById("results").innerHTML = "加载 Excel 文件时出错。";
  });

// 监听输入框回车事件
document
  .getElementById("searchInput")
  .addEventListener("keypress", async function (event) {
    if (event.key === "Enter") {
      const searchValue = event.target.value.trim();
      const outputDiv = document.getElementById("results");
      outputDiv.innerHTML = ""; // 清空上次的搜索结果
      if (!excelData) {
        outputDiv.innerHTML = "数据加载中，请稍候。";
        return; // 数据还未加载完成
      }

      const keywords = searchValue.split("，").map((keyword) => keyword.trim()); // 支持多个关键词
      let foundAny = false;

      keywords.forEach((keyword) => {
        const results = excelData.filter(
          (row) => row["塔罗牌名称"] === keyword
        );
        if (results.length > 0) {
          results.forEach((result) => {
            outputDiv.innerHTML += `<div class="result-block"><h3>${result["塔罗牌名称"]}</h3><p>${result["解读内容"]}</p></div>`;
          });
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
  });
