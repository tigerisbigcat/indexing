let excelData = null; // 用来存储Excel数据

const githubExcelUrl =
  "https://github.com/tigerisbigcat/indexing/blob/main/taluo.xlsx";

fetch(githubExcelUrl)
  .then((response) => response.arrayBuffer())
  .then((data) => {
    const workbook = XLSX.read(new Uint8Array(data), { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    excelData = XLSX.utils.sheet_to_json(sheet);
    console.log(excelData);
    document.getElementById("results").innerHTML =
      "数据加载完成，请输入塔罗牌名称进行搜索。";
  })
  .catch((error) => {
    console.error("Error loading Excel file:", error);
    document.getElementById("results").innerHTML = "加载 Excel 文件时出错。";
  });

// 监听文件上传
document
  .getElementById("fileInput")
  .addEventListener("change", function (event) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      excelData = XLSX.utils.sheet_to_json(sheet);

      // 将数据缓存到 LocalStorage
      localStorage.setItem("excelData", JSON.stringify(excelData));

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
          .map((keyword) => keyword.trim());
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
