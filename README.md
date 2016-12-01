## 用HTML做设计 然后自动把HTML转换为Javascript Native
- 下载代码 执行npm install
- 在浏览器中执行http://loacalhost:1219
- 在html代码框中输入html代码
- 在element元素中的name属性中追加该element对应的js代码的变量名称<br>
例如:`<button name="closeButton"></button>`
- 在代码转换的时候，会把css中的style名字，转换为对应的js代码中的变量<br>
例如:".bannerHeaderCss: {}" => "var bannerHeaderCss = {};"