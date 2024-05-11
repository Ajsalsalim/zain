const giveCurrentDateTime = () => {
    const today = new Date();
    const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    const dateTime = date + ' ' + time;
    return dateTime;
}
const generateWhatsAppLink=(phoneNumber)=> {
    return `https://wa.me/${phoneNumber}`;
  }
  module.exports={
    giveCurrentDateTime,
    generateWhatsAppLink
  }