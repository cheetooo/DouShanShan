// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

chrome.webNavigation.onCompleted.addListener(function() {
  let blockKeyWord
  chrome.storage.sync.get('blockKeyWord', (data) => {
    blockKeyWord = data.blockKeyWord
    if (blockKeyWord) {
      chrome.tabs.query({
        active: true,
        currentWindow: true
      }, function (tabs) {
        chrome.tabs.executeScript(
          tabs[0].id, {
            code: `Array.from(document.querySelectorAll('.olt tr td.title')).forEach(i=>{
              if(i.innerText.includes('${blockKeyWord}')){
                i.parentNode.style.filter = 'blur(10px)'
              }
            })`
          });
      });
    }
  })
  
});