export function getModalConfig(messageType: 'all' | 'single') {
  const content =
    messageType === 'all'
      ? 'Are you sure you want to remove all the products from the cart?'
      : 'Are you sure you want to remove this product from the cart?';
  return {
    data: {
      title: '',
      content,
      buttonOK: 'YES',
      buttonNG: 'NO'
    },
    width: '500px',
    height: '180px',
    panelClass: 'dialog'
  };
}
