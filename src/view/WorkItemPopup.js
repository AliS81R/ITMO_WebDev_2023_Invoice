class WorkItemPopup {
  constructor(dom) {
    this.dom = dom;
  }

  open(workItemVO) {
    console.log('> WorkItemPopup -> open', workItemVO);
    this.dom.classList.remove('hidden');
    this.dom.querySelector('#inputWorkItemQty').value = workItemVO.quantity;
  }
}

export default WorkItemPopup;