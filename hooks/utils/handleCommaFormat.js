export default (text) => {
  if (typeof text === 'string') {
    return Number(text.replaceAll(",", ""));
  } else {
    return text.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
}