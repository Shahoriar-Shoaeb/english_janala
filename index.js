// add saveWord feature

const createElements = (arr) => {
    const htmlElements = arr.map((el) => `<span class="btn">${el}</span>`);
    return htmlElements.join(" ");
};

function pronounceWord(word) {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "en-EN"; // English
    window.speechSynthesis.speak(utterance);
  }

const manageSpinner = (isLoading) =>{
    const spinner = document.getElementById("spinner");
    if(isLoading){
        document.getElementById("spinner").classList.remove("hidden");
        document.getElementById("word_container").classList.add("hidden");
    }
    else{
        document.getElementById("spinner").classList.add("hidden");
        document.getElementById("word_container").classList.remove("hidden");
    }
    // if(isLoading){
    //     spinner.classList.remove("hidden");
    // }
    // else{
    //     spinner.classList.add("hidden");
    // }
};

const loadlessons  = () =>{
    fetch("https://openapi.programming-hero.com/api/levels/all") //promises response
    .then(res => res.json())  //promises json data
    .then((json) => displayLesson(json.data)) //
};

const removeActive = () =>{
    const allBtn = document.querySelectorAll(".lesson_btn");
    // console.log(allBtn);
    allBtn.forEach(btn => btn.classList.remove("active"));
};

const loadLevelWord = (id) =>{
    manageSpinner(true);
    const url = `https://openapi.programming-hero.com/api/level/${id}`;
    fetch(url)
    .then(res => res.json())    
    .then(json => {
        removeActive();
        const clickBtn = document.getElementById(`lesson_btn_${id}`);
        clickBtn.classList.add("active")
        displayLevelWord(json.data)
});
};

const loadWordDetail = async(id) =>{
    const url = `https://openapi.programming-hero.com/api/word/${id}`;
    const res = await fetch(url)
    const details = await res.json();
    displayWordDetails(details.data);
};

const displayWordDetails = (word) =>{
    // console.log(word);
    const detailsBox = document.getElementById("details_container");
    detailsBox.innerHTML = `
    <div class="">
        <h2 class="text-2xl font-bold">${word.word} (<i class="fa-solid fa-microphone"></i>:${word.pronunciation})</h2>
      </div>
      <div class="">
        <h2 class="font-bold">Meaning</h2>
        <p>${word.meaning}</p>
      </div>
      <div class="">
        <h2 class="font-bold">Example</h2>
        <p>${word.sentence}</p>
      </div>
      <div class="">
        <h2 class="font-bold">Synonyms</h2>
        <div class>${createElements(word.synonyms)}</div>
      </div>
    `;
    document.getElementById("word_modal").showModal();

};

const displayLevelWord = (words) =>{
    const wordContainer = document.getElementById("word_container");
    wordContainer.innerHTML = "";
    if(words.length === 0){
        // alert("no word detected");
        wordContainer.innerHTML = ` 
        <div class="text-center col-span-full rounded-xl py-10 space-y-6 font-bangla">
            <img class="mx-auto" src="assets/alert-error.png">
            <p class="text-xl font-medium text-gray-600">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
            <h1 class="font-bold text-3xl">নেক্সট Lesson এ যান</h1>
        </div>
        `;
        manageSpinner(false)
        return;
    }
    words.forEach((word) => {
        const wordDiv = document.createElement("div");
        wordDiv.innerHTML = `
                <div class="bg-white rounded-xl shadow-sm text-center py-10 px-5 space-y-4">
            <h2 class="font-bold text-2xl">${word.word ? word.word : "কোন শব্দ পাওয়া যায়নি"}</h2>
            <p class="font-semibold">Meaning/Pronounciation</p>
            <div class="text-2xl font-semibold font-bangla">${word.meaning ? word.meaning : "কোন অর্থ পাওয়া যায় নি"}/${word.pronunciation ? word.pronunciation : "কোন উচ্চারণ পাওয়া যায়নি"}</div>
            <div class="flex justify-between items-center">
                <button onclick = "loadWordDetail(${word.id})" class="btn bg-[rgba(26,145,255,0.1)] hover:bg-[rgba(26,145,255,80%)]"><i class="fa-solid fa-circle-info"></i></button>
                <button onclick = "pronounceWord('${word.word}')" class="btn bg-[rgba(26,145,255,0.1)] hover:bg-[rgba(26,145,255,80%)]"><i class="fa-solid fa-volume-high"></i></button>
            </div>
            
        </div>
        `;
        wordContainer.appendChild(wordDiv);
    })
    manageSpinner(false)
};

const displayLesson = (lessons) => {
    // 1. get the container and empty it 
    
    const levelContainer = document.getElementById("level_container");
    levelContainer.innerHTML = "";

    // 2. get into every element 
    for (let lesson of lessons) { 
    // 3.create element
    const btnDiv = document.createElement("div");
    btnDiv.innerHTML = `
     <button id ="lesson_btn_${lesson.level_no}" onclick="loadLevelWord(${lesson.level_no})" class="btn btn-outline btn-primary lesson_btn"><i class="fa-solid fa-book-open"></i>Lesson-${lesson.level_no}</button>  
    `;
    // 4.append into container
    levelContainer.append(btnDiv);
  }
};
loadlessons();

document.getElementById("btn_search").addEventListener("click", () =>{
    removeActive();
    const input = document.getElementById("input_search");
    const searchValue = input.value.trim().toLowerCase() ;
    fetch("https://openapi.programming-hero.com/api/words/all")
    .then(res => res.json())
    .then((data) => {
        const allWords = data.data;
        const matchedWord = allWords.filter((word) => word.word.toLowerCase().includes(searchValue));
        displayLevelWord(matchedWord);
    })
})