const cloud = require('wx-server-sdk')
cloud.init()
exports.main = async (event, context) => {

  let { OPENID, APPID, UNIONID } = cloud.getWXContext()

  try {
    const result = await cloud.openapi.templateMessage.send({
      touser: OPENID,
      page: 'pages/test/test',
      data: event.data,
      templateId: 'kpsjGaZBhVo6TXpm4_1DrR1WdLE_-39EW1nqBRz9WW8',
      formId: event.formId,
      emphasisKeyword:"keyword2.DATA"
    })
    console.log(result)
    return result
  } catch (err) {
    console.log(err)
    return err
  }
}
