const loadlessons  = () =>{
    fetch("https://openapi.programming-hero.com/api/levels/all") //promises response
    .then(res => res.json())  //promises json data
    .then((json) => displayLesson(json.data)) //
}

const loadLevelWord = (id) =>{
    const url = `https://openapi.programming-hero.com/api/level/${id}`;
    fetch(url)
    .then(res => res.json())    
    .then(json => displayLevelWord(json.data))
}

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
        return;
    }
    words.forEach((word) => {
        const wordDiv = document.createElement("div");
        wordDiv.innerHTML = `
                <div class="bg-white rounded-xl shadow-sm text-center py-10 px-5 space-y-4">
            <h2 class="font-bold text-2xl">${word.word}</h2>
            <p class="font-semibold">Meaning/Pronounciation</p>
            <div class="text-2xl font-semibold font-bangla">${word.meaning}/${word.pronounciation}</div>
            <div class="flex justify-between items-center">
                <button class="btn bg-[rgba(26,145,255,0.1)] hover:bg-[rgba(26,145,255,80%)]"><i class="fa-solid fa-circle-info"></i></button>
                <button class="btn bg-[rgba(26,145,255,0.1)] hover:bg-[rgba(26,145,255,80%)]"><i class="fa-solid fa-volume-high"></i></button>
            </div>
            
        </div>
        `;
        wordContainer.appendChild(wordDiv);
    })
}

const displayLesson = (lessons) => {
    // 1. get the container and empty it 
    
    const levelContainer = document.getElementById("level_container");
    levelContainer.innerHTML = "";

    // 2. get into every element 
    for (let lesson of lessons) { 
    // 3.create element
    const btnDiv = document.createElement("div");
    btnDiv.innerHTML = `
     <button onclick="loadLevelWord(${lesson.level_no})" class="btn btn-outline btn-primary"><i class="fa-solid fa-book-open"></i>Lesson-${lesson.level_no}</button>  
    `;
    // 4.append into container
    levelContainer.append(btnDiv);
  }
};
loadlessons();