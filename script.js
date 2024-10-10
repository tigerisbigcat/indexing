let excelData = null; // 用来存储Excel数据

// 页面加载时检查localStorage中是否有存储的Excel数据
window.onload = function () {
  const savedData = localStorage.getItem("excelData");
  if (savedData) {
    excelData = JSON.parse(savedData); // 将JSON字符串转换回对象
    document.getElementById("results").innerHTML = "已加载存储的Excel数据。";
  }
};

// 监听文件上传
document
  .getElementById("fileInput")
  .addEventListener("change", function (event) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0]; // 获取第一个sheet
      const sheet = workbook.Sheets[sheetName];
      excelData = XLSX.utils.sheet_to_json(sheet);
      console.log(excelData); // 打印数据进行调试
      localStorage.setItem("excelData", JSON.stringify(excelData)); // 将数据存储到localStorage
      document.getElementById("results").innerHTML =
        "文件已上传并存储，下次无需再次上传。";
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
      if (excelData) {
        const searchValues = searchValue.split("，").map((val) => val.trim()); // 将输入的关键词用逗号分隔，并去除多余的空格
        let foundResults = false;
        outputDiv.innerHTML = ""; // 清空之前的搜索结果
        searchValues.forEach((searchVal) => {
          const result = excelData.find(
            (row) => row["塔罗牌名称"] === searchVal
          );
          if (result) {
            foundResults = true;
            outputDiv.innerHTML += `<div class="result-block"><h3>${result["塔罗牌名称"]}</h3><p>${result["解读内容"]}</p></div>`;
          } else {
            outputDiv.innerHTML += `未找到对应的塔罗牌: ${searchVal}<br>`;
          }
        });
        if (!foundResults) {
          outputDiv.innerHTML = `未找到任何结果: ${searchValue}`;
        }
      } else {
        outputDiv.innerHTML = "请先上传塔罗牌文件。";
      }
    }
  });
