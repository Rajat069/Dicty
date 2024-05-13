const wrapper = document.querySelector(".wrapper"),
searchInput = wrapper.querySelector("input"),
volume = wrapper.querySelector(".word i"),
infoText = wrapper.querySelector(".info-text"),
synonyms = wrapper.querySelector(".synonyms .list"),
removeIcon = wrapper.querySelector(".search span");
let audio;

async function data(result, word){
    if(result.title){
        wrapper.style.border = "2px red solid";
        infoText.innerHTML = `Can't find the meaning of <span>"${word}"</span>. Please, try to search for another word.`;
    }else{
        wrapper.style.border = "2px #f4c24e solid";
        wrapper.classList.add("active");
        let definitions = result[0].meanings[0].definitions[0];
        
        document.querySelector(".wrapper").style.marginTop = "30px";
        phontetics = `${result[0].meanings[0].partOfSpeech}  /${result[0].phonetics[0].text}/`;
        document.querySelector(".word p").innerText = result[0].word;
        document.querySelector(".word span").innerText = phontetics;

        document.querySelector(".meaning span").innerText = "1. "+definitions.definition;
        document.querySelector("#m2").innerText = "2. "+result[0].meanings[0].definitions[1].definition;

        document.querySelector(".example span").innerText = await getExample(result);

        let word = document.querySelector(".word p").innerText;
        highlightText(document.querySelector(".example span"),word);

        audio = new Audio("https:" + result[0].phonetics[0].audio);

        if(definitions.synonyms[0] == undefined){
            synonyms.parentElement.style.display = "none";
        }else{
            synonyms.parentElement.style.display = "block";
            synonyms.innerHTML = "";
            for (let i = 0; i < 5; i++) {
                let tag = `<span onclick="search('${definitions.synonyms[i]}')">${definitions.synonyms[i]},</span>`;
                tag = i == 4 ? tag = `<span onclick="search('${definitions.synonyms[i]}')">${definitions.synonyms[4]}</span>` : tag;
                synonyms.insertAdjacentHTML("beforeend", tag);
            }
        }
    }
}
function highlightText(html, word){
    let example=html.innerText.split(" ");
    for(let w in example){
        if(example[w].toLowerCase().includes(word.toLowerCase())){
            html.innerHTML = html.innerHTML.replace(example[w],`<span style="color:red">${example[w]}</span>`);
        }
    }
    return html;
}
function getExample(result){
    for(let i=0;i<result.length;i++){
        for(let def in result[i].meanings[0].definitions){
         if(result[i].meanings[0].definitions[def].example){
            return result[i].meanings[0].definitions[def].example;
         }
      }
    }
    return "No Example Available";

}
function search(word){
    fetchApi(word);
    searchInput.value = word;
}

function fetchApi(word){
    wrapper.classList.remove("active");
    infoText.style.color = "#000";
    infoText.innerHTML = `Searching the meaning of <span>"${word}"</span>`;
    let url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
    fetch(url).then(response => response.json()).then(result => data(result, word)).catch(() =>{
        infoText.innerHTML = `Can't find the meaning of <span>"${word}"</span>. Please, try to search for another word.`;
    });
}

searchInput.addEventListener("keyup", e =>{
    let word = e.target.value.replace(/\s+/g, ' ');
    if(e.key == "Enter" && word){
        fetchApi(word);
    }
});

volume.addEventListener("click", ()=>{
    volume.style.color = "#4D59FB";
    audio.play();
    setTimeout(() =>{
        volume.style.color = "#999";
    }, 800);
});

removeIcon.addEventListener("click", ()=>{
    searchInput.value = "";
    searchInput.focus();
    wrapper.classList.remove("active");
    infoText.style.color = "#9A9A9A";
    wrapper.style.border = "none";
    infoText.innerHTML = "Type any existing word and press enter to get meaning, example, synonyms, etc.";
});