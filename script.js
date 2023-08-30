function switchSection(sectionIndex) {
    const sections = document.querySelectorAll('.section');
    const links = document.querySelectorAll('.icon-bar a');
    
    for (let i = 0; i < sections.length; i++) {
        if (i === sectionIndex) {
            sections[i].classList.add('active');
            links[i].classList.add('active');
        } else {
            sections[i].classList.remove('active');
            links[i].classList.remove('active');
        }
    }
}

function speak(sectionId) {
    const textarea = document.getElementById(sectionId + '-text');
    const textToSpeak = textarea.value;

    if ('speechSynthesis' in window) {
        const speech = new SpeechSynthesisUtterance(textToSpeak);
        const lang = detectLanguage(textToSpeak);
        const voice = getVoiceByLanguage(lang);
        if (voice) {
            speech.voice = voice;
        }

        speechSynthesis.speak(speech);
    } else {
        console.log("Speech synthesis not supported");
    }
}

function detectLanguage(text) {
    const japanesePattern = /[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}ー]/u;

    if (japanesePattern.test(text)) {
        return 'ja-JP';
    } else {
        return 'en-US';
    }
}

function getVoiceByLanguage(lang) {
    const voices = speechSynthesis.getVoices();
    return voices.find(v => v.lang === lang);
}

function saveTextToLocal(textAreaId) {
    const textArea = document.getElementById(textAreaId);
    const text = textArea.value;
  
    if (text.trim() !== '') {
      localStorage.setItem(textAreaId, text);
      alert('Text saved to local storage!');
    } else {
      alert('Please enter some text before saving.');
    }
  }
  
  const textAreaSection0 = document.getElementById('section0-text');
  textAreaSection0.addEventListener('input', () => {
    const text = textAreaSection0.value;
    localStorage.setItem('section0-text', text);
  });
  
  const textAreaSection2 = document.getElementById('section2-text');
  textAreaSection2.addEventListener('input', () => {
    const text = textAreaSection2.value;
    localStorage.setItem('section2-text', text);
  });
  
  window.onload = function() {
    const savedTextSection0 = localStorage.getItem('section0-text');
    if (savedTextSection0) {
      textAreaSection0.value = savedTextSection0;
    }
  
    const savedTextSection2 = localStorage.getItem('section2-text');
    if (savedTextSection2) {
      textAreaSection2.value = savedTextSection2;
    }
  };
  
  
  const addBox = document.querySelector(".add-box"),
popupBox = document.querySelector(".popup-box"),
popupTitle = popupBox.querySelector("header p"),
closeIcon = popupBox.querySelector("header i"),
titleTag = popupBox.querySelector("input"),
descTag = popupBox.querySelector("textarea"),
addBtn = popupBox.querySelector("button");
const months = ["January", "February", "March", "April", "May", "June", "July",
              "August", "September", "October", "November", "December"];
const notes = JSON.parse(localStorage.getItem("notes") || "[]");
let isUpdate = false, updateId;
addBox.addEventListener("click", () => {
    popupTitle.innerText = "新しい記録の作成";
    addBtn.innerText = "追加";
    popupBox.classList.add("show");
    document.querySelector("body").style.overflow = "hidden";
    if(window.innerWidth > 660) titleTag.focus();
});
closeIcon.addEventListener("click", () => {
    isUpdate = false;
    titleTag.value = descTag.value = "";
    popupBox.classList.remove("show");
    document.querySelector("body").style.overflow = "auto";
});
function showNotes() {
    if(!notes) return;
    document.querySelectorAll(".note").forEach(li => li.remove());
    notes.forEach((note, id) => {
        let filterDesc = note.description.replaceAll("\n", '<br/>');
        let liTag = `<li class="note">
                        <div class="details">
                            <p>${note.title}</p>
                            <span>${filterDesc}</span>
                        </div>
                        <div class="bottom-content">
                            <div class="settings">
                                <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                                <ul class="menu">
                                    <li onclick="updateNote(${id}, '${note.title}', '${filterDesc}')"><i class="uil uil-pen"></i>編集</li>
                                    <li onclick="deleteNote(${id})"><i class="uil uil-trash"></i>削除</li>
                                </ul>
                            </div>
                        </div>
                    </li>`;
        addBox.insertAdjacentHTML("afterend", liTag);
    });
}
showNotes();
function showMenu(elem) {
    elem.parentElement.classList.add("show");
    document.addEventListener("click", e => {
        if(e.target.tagName != "I" || e.target != elem) {
            elem.parentElement.classList.remove("show");
        }
    });
}
function deleteNote(noteId) {
    let confirmDel = confirm("本当に削除しますか?");
    if(!confirmDel) return;
    notes.splice(noteId, 1);
    localStorage.setItem("notes", JSON.stringify(notes));
    showNotes();
}
function updateNote(noteId, title, filterDesc) {
    let description = filterDesc.replaceAll('<br/>', '\r\n');
    updateId = noteId;
    isUpdate = true;
    addBox.click();
    titleTag.value = title;
    descTag.value = description;
    popupTitle.innerText = "編集中";
    addBtn.innerText = "更新する";
}
addBtn.addEventListener("click", e => {
    e.preventDefault();
    let title = titleTag.value.trim(),
    description = descTag.value.trim();
    if(title || description) {
        let currentDate = new Date(),
        month = months[currentDate.getMonth()],
        day = currentDate.getDate(),
        year = currentDate.getFullYear();
        let noteInfo = {title, description, date: `${month} ${day}, ${year}`}
        if(!isUpdate) {
            notes.push(noteInfo);
        } else {
            isUpdate = false;
            notes[updateId] = noteInfo;
        }
        localStorage.setItem("notes", JSON.stringify(notes));
        showNotes();
        closeIcon.click();
    }
});
