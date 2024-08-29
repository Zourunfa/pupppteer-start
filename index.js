const puppeteer = require('puppeteer')

async function setChromeFlags() {
  try {
    // 启动一个新的浏览器实例
    const browser = await puppeteer.launch({
      headless: false, // 如果你想看到浏览器界面，可以设置为 false
      args: ['--no-sandbox'], // 添加必要的启动参数
    })

    const page = await browser.newPage()

    // 导航到 chrome://flags 页面
    await page.goto('chrome://flags')

    // 等待页面加载完成
    await page.waitForTimeout(5000) // 等待一段时间让页面完全加载

    // 查找并设置 block-insecure-private-network-requests 标志
    const flagSelector = 'input[name="block-insecure-private-network-requests"]'
    const flagElement = await page.$(flagSelector)

    if (flagElement) {
      // 获取当前选择的值
      const currentValue = await page.evaluate(() => {
        const dropdown = document.querySelector('.dropdown')
        return dropdown.querySelector('div').textContent.trim()
      })

      // 如果当前值不是 "Enabled"，则设置为 "Enabled"
      if (currentValue !== 'Enabled') {
        await page.click(flagSelector)
        await page.waitForTimeout(1000) // 等待一段时间让下拉菜单展开

        // 选择 "Enabled" 选项
        await page.click('.dropdown > div:nth-child(2)')
        await page.waitForTimeout(1000) // 等待一段时间让设置生效

        // 确认设置已更改
        const newValue = await page.evaluate(() => {
          const dropdown = document.querySelector('.dropdown')
          return dropdown.querySelector('div').textContent.trim()
        })

        console.log(`Flag value changed from "${currentValue}" to "${newValue}"`)
      } else {
        console.log('Flag is already set to "Enabled".')
      }
    } else {
      console.error('Flag element not found.')
    }

    // 关闭浏览器实例
    await browser.close()
  } catch (error) {
    console.error('Error setting Chrome flags:', error)
  }
}

setChromeFlags()
