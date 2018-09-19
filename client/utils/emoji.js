var emojiMap = {
  '[微笑]': 'emot01.png',
  '[大笑]': 'emot02.png',
  '[鼓掌]': 'emot03.png',
  '[不说了]': 'emot04.png',
  '[为什么]': 'emot05.png',
  '[哭]': 'emot06.png',
  '[不屑]': 'emot07.png',
  '[怒]': 'emot08.png',
  '[滴汗]': 'emot09.png',
  '[拜神]': 'emot10.png',
  '[胜利]': 'emot11.png',
  '[亏大了]': 'emot12.png',
  '[赚大了]': 'emot13.png',
  '[牛]': 'emot14.png',
  '[俏皮]': 'emot15.png',
  '[傲]': 'emot16.png',
  '[好困惑]': 'emot17.png',
  '[兴奋]': 'emot18.png',
  '[赞]': 'emot19.png',
  '[不赞]': 'emot20.png',
  '[摊手]': 'emot21.png',
  '[好逊]': 'emot22.png',
  '[失望]': 'emot23.png',
  '[加油]': 'emot24.png',
  '[困顿]': 'emot25.png',
  '[想一下]': 'emot26.png',
  '[围观]': 'emot27.png',
  '[献花]': 'emot28.png',
  '[大便]': 'emot29.png',
  '[爱心]': 'emot30.png',
  '[心碎]': 'emot31.png',
  '[毛估估]': 'emot32.png',
  '[成交]': 'emot33.png',
  '[财力]': 'emot34.png',
  '[护城河]': 'emot35.png',
  '[复盘]': 'emot36.png',
  '[买入]': 'emot37.png',
  '[卖出]': 'emot38.png',
  '[满仓]': 'emot39.png',
  '[空仓]': 'emot40.png',
  '[抄底]': 'emot41.png',
  '[看多]': 'emot42.png',
  '[看空]': 'emot43.png',
  '[加仓]': 'emot44.png',
  '[减仓]': 'emot45.png'
}

function parseEmoji(text) {
  return text.replace(/\[[\u4e00-\u9fa5]+?\]/g, function ($) {
    return '<img class="emoji" src="	https://qcloudtest-1257454171.cos.ap-guangzhou.myqcloud.com/img/emoji/' + emojiMap[$] + '" alt="' + $ + '">'
  })
}

module.exports = {
  emojiMap: emojiMap,
  parseEmoji: parseEmoji  
}