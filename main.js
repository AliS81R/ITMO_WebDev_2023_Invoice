import './input.css';
import {checkInputOnValidLengthAndNumberOnly, executeMethodWhenTargetInputValid} from './src/utils/textUtils.js';

const processNumericInputWithLimit = (target, length, method, next) => {
    executeMethodWhenTargetInputValid(
      target, method, checkInputOnValidLengthAndNumberOnly, length) && !!next && next();
};

const saveInvoice = () => localStorage.setItem(InvoiceVO.LOCAL_KEY, JSON.stringify(invoiceVO));

const DOM = (id) => document.getElementById(id) || {};
const findWorkItemVOById = (id) => invoiceVO.items.find((i) => i.id === id);

const domTableWorkItems = DOM('tableWorkItems');
const domWorkItem = domTableWorkItems.children[0];
const domInputWorkItemQyt = DOM('inputWorkItemQty');
// const popupWorkItem = new WorkItemPopup(DOM('popupWorkItemContainer'));

console.log('> domWorkItem', domWorkItem);

const renderWorkItem = (workItemVO) => {
  const domCloneWorkItem = domWorkItem.cloneNode(true);
  console.log('> renderWorkItem', workItemVO, domCloneWorkItem);
  domCloneWorkItem.dataset.id = workItemVO.id;
  for (const domCloneWorkItemKey in  [...domCloneWorkItem.children]) {
    domCloneWorkItem.children[domCloneWorkItemKey].style.pointerEvents = 'none';
  }

  // domCloneWorkItem.style.pointerEvents = 'none';
  domCloneWorkItem.classList.remove('hidden');
  domCloneWorkItem.children[3].innerText = workItemVO.cost * workItemVO.quantity;
  domTableWorkItems.appendChild(domCloneWorkItem);
};

const updateTotal = () => {
  const subTotal = invoiceVO.items.reduce(
    (prev, curr) => (prev += curr.cost * curr.quantity, prev), 0);
  const valueWIthDiscount = subTotal * (1 - invoiceVO.discount / 100);
  const total = valueWIthDiscount * (1 + invoiceVO.taxes / 100);
  DOM('resultsSubtotalContainer').innerText = subTotal;
  DOM('resultsDiscountContainer').innerText = valueWIthDiscount.toString();
  DOM('resultsTaxesContainer').innerText = total.toString();
};

class InvoiceVO {
    static LOCAL_KEY = 'invoice';
  id;
  items;
  discount;
  taxes;
  iban;

  constructor(id = '', items = [], discount = 0, taxes = 0, iban = '') {
    this.id = id;
    this.items = items;
    this.discount = discount;
    this.taxes = taxes;
    this.iban = iban;
  }
}

class WorkItemVO {
  static createCopy(item){
    return new WorkItemVO(item.id, item.cost, item.quantity, item.title, item.description);
  }
  id;
  cost;
  quantity;
  title;
  description;
  constructor(id, cost = 0, quantity = 0, title = '', description = '') {
    this.id = id;
    this.cost = cost;
    this.quantity = quantity;
    this.title = title;
    this.description = description;
  }
}

let selectedWorkItemVO = null;
const rawInvoice = localStorage.getItem(InvoiceVO.LOCAL_KEY);
const invoiceVO = rawInvoice ? JSON.parse(rawInvoice) : new InvoiceVO();

invoiceVO.items.push(new WorkItemVO('1', 140, 2, 'dfsf', 'dsdas'));
invoiceVO.items.push(new WorkItemVO('2', 330, 1, 'dfsf', 'dsdas'));

DOM('inputDiscountPercent').value = invoiceVO.discount;
DOM('inputInvoiceNumber').value = invoiceVO.id;

invoiceVO.items.forEach((vo) => renderWorkItem(vo));
updateTotal();

function openPopupWorkItem(selectedWorkItemVO) {
  DOM('popupWorkItemContainer').classList.remove('hidden');
  domInputWorkItemQyt.value = selectedWorkItemVO.quantity;
}

DOM('btnAddWorkItem').onclick = () => {
  selectedWorkItemVO = new WorkItemVO(Date.now());
  openPopupWorkItem(selectedWorkItemVO);
  // popupWorkItem.open(selectedWorkItemVO);
};

domTableWorkItems.onclick = ({target}) => {
  const workItemId = target.dataset.id;
  selectedWorkItemVO = WorkItemVO.createCopy(findWorkItemVOById(workItemId));
  console.log('> target', selectedWorkItemVO);
  // popupWorkItem.open(selectedWorkItemVO);
  openPopupWorkItem(selectedWorkItemVO);
};

domInputWorkItemQyt.oninput = ({target}) => processNumericInputWithLimit(target, 3, (value) => {
  selectedWorkItemVO.quantity = parseInt(value);
  // updateTotal();
}, saveInvoice);

DOM('btnCloseWorkItemPopup').onclick = () => {
  DOM('popupWorkItemContainer').classList.add('hidden');
  selectedWorkItemVO = null;
};

DOM('inputDiscountPercent').oninput = ({target}) => processNumericInputWithLimit(target, 2, (value) => {
  invoiceVO.discount = parseInt(value);
  updateTotal();
}, saveInvoice);
DOM('inputTaxPercent').oninput = ({target}) => processNumericInputWithLimit(target, 2, (value) => {
  invoiceVO.taxes = parseInt(value);
  updateTotal();
}, saveInvoice);
DOM('inputInvoiceNumber').oninput = ({target}) => processNumericInputWithLimit(target, 3, (value) => {
  invoiceVO.id = value;
}, saveInvoice);

domInputWorkItemQyt.oninput = ({target}) => processNumericInputWithLimit(target, 3, (value) => {
  selectedWorkItemVO.quantity = parseInt(value);
  const originalWorkItemVO = findWorkItemVOById(selectedWorkItemVO.id);
  console.log('> domInputWorkItemQyt -> onclick:', {value}, originalWorkItemVO);
  setActiveSaveWorkItemButton(JSON.stringify(selectedWorkItemVO) !== JSON.stringify(originalWorkItemVO));
});

const setActiveSaveWorkItemButton = (isActive) => {
  console.log('> WorkItem -> setActiveSaveWorkItemButton', {isActive});
  DOM('btnCreateWorkItem').disable = !isActive;
};

DOM('btnSaveWorkItem').onclick = () => {
  const originalWorkItemVO = findWorkItemVOById(selectedWorkItemVO.id);
  if (originalWorkItemVO) {
    const originalWorkItemIndex = invoiceVO.items.indexOf(originalWorkItemVO);
    invoiceVO.items[originalWorkItemIndex] = selectedWorkItemVO;
  } else {
    invoiceVO.items.push(selectedWorkItemVO);
  }
  saveInvoice();
};

