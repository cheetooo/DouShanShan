// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

function removeComment(tid, cid) {
  const url = `https://www.douban.com/group/topic/${tid}/remove_comment?cid=${cid}`
  sendRequest(url, cid)
}

function getTid() {
  return location.pathname.split('/')[3]
}

function getCk() {
  return chrome.cookies.getAll({
    domain: '.douban.com',
    name: 'ck'
  }, function (cookie) {
    return cookie[0].value
  });
}

function getDataObject(cid) {
  return {
    ck: getCk(),
    cid: cid,
    reason: 'other_reason',
    other: '其他原因删帖，抱歉啦',
    submit: '确定'
  }
}

function sendRequest(url, cid) {
  const data = new URLSearchParams()
  const dataObject = getDataObject(cid)

  for (const [k, v] of Object.entries(dataObject)) {
    data.append(k, v)
  }

  $.ajax({
    type: 'POST',
    url: url,
    data: data.toString(),
    contentType: 'application/x-www-form-urlencoded'
  })
}

function deleteCommentList() {
  Array.from(document.querySelectorAll('#comments > li')).forEach(i => {
    removeComment(getTid(), i.id)
  })
}

let blockButton = document.getElementById('block-button')
let resetButton = document.getElementById('reset-button')

resetButton.onclick = () => {
  chrome.storage.sync.set({
    blockKeyWord: ''
  }, function () {
    alert('我回来了');
    chrome.tabs.query({
      active: true,
      currentWindow: true
    }, function (tabs) {
      chrome.tabs.executeScript(
        tabs[0].id, {
          code: `location.reload()`
        });
    });
  })
}

blockButton.onclick = () => {
  let blockKeyWord = document.getElementById('block-input').value
  if (blockKeyWord) {
    chrome.storage.sync.set({
      blockKeyWord: blockKeyWord
    }, function () {
      alert('再见，' + blockKeyWord);
      chrome.tabs.query({
        active: true,
        currentWindow: true
      }, function (tabs) {
        chrome.tabs.executeScript(
          tabs[0].id, {
            code: `location.reload()`
          });
      });
    });
  } else {
    alert('你到底要和谁说再见啦！' );
  }
}