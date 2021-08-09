const tabDate = [];
const AR_UNE = [];
const AR_MONDE = [];
const AR_SCIENCES = [];

const AR_UNE_CONTENT = [];
const AR_MONDE_CONTENT = [];
const AR_SCIENCES_CONTENT = [];

//--------------------------------------------------------------------------------------------

const key_a ="ArrayALL"

//--------------------------------------------------------------------------------------------

const value = triActus(tabDate, "AZ"); // ZA

const body = document.querySelector('body');
const header = document.querySelector('.header');
const footer = document.querySelector('.footer');
const tri = document.querySelector('.tri');
const lineAdvancement = document.querySelector('.lineAdvancement');
const circleAdvancement = document.querySelector('.circleAdvancement');
const content = document.querySelector('.content');
const LastMaj = document.querySelector('.LastMaj');
const refreshActus = document.querySelector('.refreshActus');

//--------------------------------------------------------------------------------------------

window.onscroll = function(){
    // circleAdvancement.style.transform =
    //     "translateY(" +
    //     (window.scrollY)/((document.body.scrollHeight - window.innerHeight)/lineAdvancement.offsetHeight)
    //     + "px)";
}

window.onload = function (){
    loadActus();
    initialFlux();
}

//--------------------------------------------------------------------------------------------

const dateNow = new Date();

function loadActus(){
    refreshActus.classList.add('spin');

    const nghttp = new XMLHttpRequest();
    nghttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            const str = this.responseText;

            function splitThemes(item) {
                const AR_res = [];
                const eachTheme = item.split("&&_8_811_&&&");

                eachTheme.forEach(function(value){
                    const date = value.split("_====_");
                    const name = date[1].split("_&&&&_");
                    let arrayMain = name[1].split("@@@@");
                    AR_res.push(date[0],name[0],arrayMain);
                });

                for(let i = 0 ; i < AR_res[2].length ; i ++){
                    AR_UNE_CONTENT.push(AR_res[2][i].split('____'));
                }
                for(let i = 0 ; i < AR_res[5].length ; i ++){
                    AR_MONDE_CONTENT.push(AR_res[5][i].split('____'));
                }
                for(let i = 0 ; i < AR_res[8].length ; i ++){
                    AR_SCIENCES_CONTENT.push(AR_res[8][i].split('____'));
                }

                AR_UNE.push(AR_res[0], AR_res[1], AR_UNE_CONTENT)
                AR_MONDE.push(AR_res[3], AR_res[4], AR_MONDE_CONTENT)
                AR_SCIENCES.push(AR_res[6], AR_res[7], AR_SCIENCES_CONTENT)

                const dateRefresh = new Date();

                let year = dateRefresh.getFullYear();

                const options = { month: 'long'};
                const month = new Intl.DateTimeFormat('fr-FR', options).format(dateRefresh);

                let d = dateRefresh.getDay();
                if (d < 10) {
                    d = "0" + d
                }

                let h = dateRefresh.getHours();
                if (h < 10) {
                    h = "0" + h
                }
                let m = dateRefresh.getMinutes();
                if (m < 10) {
                    m = "0" + m
                }

                LastMaj.innerHTML = d + " " + month + " " + year + ", à " + h + ":" + m;


                return {
                    ARRAY_UNE: AR_UNE,
                    ARRAY_MONDE: AR_MONDE,
                    ARRAY_SCIENCES: AR_SCIENCES,
                };
            }
            localStorage.setItem(key_a, JSON.stringify(splitThemes(str)));
        }
        else {}
    };
    nghttp.open("GET", "https://nicolasvaillant.net/local/prive/load/getXML.php", true);
    nghttp.send();
}



const ACTUS_LOCALSTORAGE = JSON.parse(localStorage.getItem(key_a));

const ARRAY_ACTUS_LOCALSTORAGE = [];
const ARRAY_ACTUS_MONDE = [];

ARRAY_ACTUS_LOCALSTORAGE.push(ACTUS_LOCALSTORAGE);

const ARRAY_UNE_SORT = ARRAY_ACTUS_LOCALSTORAGE[0].ARRAY_UNE[2];
const ARRAY_MONDE_SORT = ARRAY_ACTUS_LOCALSTORAGE[0].ARRAY_MONDE[2];
const ARRAY_SCIENCES_SORT = ARRAY_ACTUS_LOCALSTORAGE[0].ARRAY_SCIENCES[2];


for(let i = 0 ; i < ARRAY_MONDE_SORT.length ; i ++){
    ARRAY_ACTUS_MONDE.push(ARRAY_MONDE_SORT[i][1]);
}
console.log(ARRAY_ACTUS_MONDE)
console.log(ARRAY_ACTUS_MONDE.sort().reverse())

function initialFlux(){

    if(ACTUS_LOCALSTORAGE !== ""){
        setActus(ACTUS_LOCALSTORAGE.ARRAY_UNE[0], ACTUS_LOCALSTORAGE.ARRAY_UNE[1], ACTUS_LOCALSTORAGE.ARRAY_UNE[2]);
    }else{
        console.error('Empty tab');
    }
}

function setActus(maj, categories, tableau) {

    //REMOVE ALL CHILD ELEMENTS BEFORE ADDED IT
    const content = document.querySelector('.content');
    while (content.firstChild) {
        content.removeChild(content.lastChild);
    }

    let numberActus = 10;

    let arrayDateToSort;
    let arrayHourToSort;
    let diffTime;

    for (let i = 0; i < numberActus; i++) {
        const content = document.querySelector('.content');


        //Content
        const divALL = document.createElement("div");
        divALL.classList.add('actusDIVALL');


        //DELETE
        const divPARDelete = document.createElement("div");
        divPARDelete.classList.add('actusDIVParadelete');
        const divPARDelete_IMG = document.createElement("img");
        divPARDelete_IMG.classList.add('divPARA_IMG');

        divPARDelete_IMG.src = "icon/trash_grey.png";
        divPARDelete.appendChild(divPARDelete_IMG);


        //CATEGORIES
        const divClass = document.createElement("div");
        divClass.classList.add('actusDIVClass');
        const divClassTitle = document.createElement("p");
        const divClassTitle_IMG = document.createElement("img");
        divClassTitle_IMG.classList.add('divClassTitle_IMG');

        if (categories === "une") {
            divClass.style.background = "var(--bl)";
            divClassTitle.innerHTML = "La Une";
            divClassTitle_IMG.src = "icon/fr.png";
        } else if (categories === "monde") {
            divClass.style.background = "#ec6b83";
            divClassTitle.innerHTML = "International";
            divClassTitle_IMG.src = "icon/world.png";
        } else {
            divClass.style.background = "#6fec6b";
            divClassTitle.innerHTML = "Sciences";
            divClassTitle_IMG.src = "icon/physic.png";
        }
        // divClass.appendChild(divClassTitle_IMG);
        divClass.appendChild(divClassTitle);


        //LINK
        const divPARAlink = document.createElement("div");
        divPARAlink.classList.add('actusDIVParalink');
        const divPARAlink_IMG = document.createElement("img");
        divPARAlink_IMG.classList.add('divPARA_IMG');
        divPARAlink_IMG.src = "icon/link_grey.png";
        const divPARAlink_A = document.createElement("a");
        divPARAlink_A.appendChild(divPARAlink_IMG);
        divPARAlink_A.style.margin = "auto";
        divPARAlink.appendChild(divPARAlink_A);


        const div = document.createElement("div");
        div.classList.add('actusDIV');

        const divUnder = document.createElement("div");
        divUnder.classList.add('actusDIVUnder');

        const gapRow = document.createElement("div");
        gapRow.classList.add('gapRow');


        divALL.addEventListener("mouseenter", function () {
            setParameters(this, tableau, i)
        });
        divALL.addEventListener("mouseleave", function () {
            unsetParameters(this)
        });


        //Picture
        const img = document.createElement("img");
        img.classList.add('actusIMG');
        img.src = tableau[i][4];


        //DATE ACTUS
        const date = document.createElement("p");
        date.classList.add('actusDate');

        let d = dateNow.getDate();
        if (d < 10) {
            d = "0" + d
        }
        let h = dateNow.getHours();
        if (h < 10) {
            h = "0" + h
        }
        let m = dateNow.getMinutes();
        if (m < 10) {
            m = "0" + m
        }
        let s = dateNow.getSeconds();
        if (s < 10) {
            s = "0" + s
        }

        arrayHourToSort = [];
        arrayDateToSort = [];
        let herPluralSing;

        arrayDateToSort.push(tableau[i][1].split("2021 ")[0].split(", ")[1].substring(0, 2));
        arrayDateToSort.push(d);
        arrayHourToSort.push(tableau[i][1].split("2021 ")[1].split(" +")[0]);
        arrayHourToSort.push(h + ":" + m + ":" + s);

        if (arrayDateToSort[1] !== arrayDateToSort[0]) {
            diffTime = 24 - parseInt(arrayHourToSort[0]) + parseInt(arrayHourToSort[1]);

            date.innerHTML = tableau[i][1].split("+")[0] + " • " + " il y a " + diffTime + " heures";

            if (diffTime > 24){
                date.innerHTML = tableau[i][1].split("+")[0] + " • " + " il y a plus d'un jour";
            }
            else{
                date.innerHTML = tableau[i][1].split("+")[0] + " • " + " il y a " + diffTime + " heures";
            }

        } else {
            diffTime = Math.abs(parseInt(arrayHourToSort[1]) - parseInt(arrayHourToSort[0]));

            if (diffTime < 1){
                date.innerHTML = tableau[i][1].split("+")[0] + " • " + " il y a moins d'une heure";
            }
            else if(diffTime === 1){
                date.innerHTML = tableau[i][1].split("+")[0] + " • " + " il y a " + diffTime + " heure";
            }
            else{
                date.innerHTML = tableau[i][1].split("+")[0] + " • " + " il y a " + diffTime + " heures";
            }
        }


        //Title
        const title = document.createElement("p");
        title.classList.add('actusTitle');
        title.innerHTML = tableau[i][0]


        //Description
        const description = document.createElement("p");
        description.classList.add('actusDescription');
        description.innerHTML = tableau[i][2]


        div.appendChild(divClass);
        div.appendChild(date);
        div.appendChild(img);
        div.appendChild(title);
        div.appendChild(description);

        divALL.appendChild(divPARAlink);
        divALL.appendChild(div);
        divALL.appendChild(divPARDelete);


        const Date = divALL.children[1].children[1].textContent.split(",")[1];
        tabDate.push(Date);

        // div.style.height = 3*(divClass.offsetHeight + img.offsetHeight + 70) + " px";

        // console.log(divClass.offsetHeight + img.offsetHeight + 70)

        divALL.id = "element_" + i;
        content.appendChild(divALL);
    }
    // setActusAnchors(numberActus);
}


function scrollIntoViewTOP(){
    window.scrollTo(0,0);
}

function setParameters(index,tableau, num) {
    index.style.background = "var(--hoverDIV)";
    index.children[0].style.opacity = "1";

    index.children[2].style.opacity = "1";
    index.children[2].onclick = function(){index.remove()};

    index.children[0].onclick = function(){
        index.children[0].children[0].href = tableau[num][3];
        index.children[0].children[0].target = "_blank";
    };
}

function unsetParameters(index) {
    index.style.background = "var(--w)";
    index.children[0].style.opacity = "0";
    index.children[2].style.opacity = "0";
}

function triActus(tabDateIN, order){
    if (order === "AZ"){
        return tabDateIN.sort();
    }else{
        return tabDateIN.sort().reverse();
    }
}

function setActusAnchors(numberActus){

    const divideBy = lineAdvancement.offsetHeight/(numberActus - 1);

    function redirectAnchors(circle, newCircleAnchorsElement) {
        //circle_0 >> element_0
        circle.style.transform = "scale(2)"
        const elements = document.querySelector('#element_' + newCircleAnchorsElement)
        elements.scrollIntoView(true); //TOP OF SCREEN
    }

    for(let i = 0; i < numberActus ; i++){
        const newCircleAnchors = document.createElement("div");
        newCircleAnchors.classList.add('newCircleAnchors');

        newCircleAnchors.style.top = i * divideBy;
        newCircleAnchors.id = "circle_" + i;

        lineAdvancement.appendChild(newCircleAnchors);
        newCircleAnchors.onclick = function(){redirectAnchors(this,this.id.split("_")[1])};
    }
}

if (document.querySelector('input[name="radio"]')) {
    document.querySelectorAll('input[name="radio"]').forEach((elem) => {
        elem.addEventListener("change", function(event) {
            console.log(event.target.value)
        });
    });
}

function changeFlux(button){

    if(button.id === "flux_une"){
        showOnly("La Une");
        setActus(ACTUS_LOCALSTORAGE.ARRAY_UNE[0], ACTUS_LOCALSTORAGE.ARRAY_UNE[1], ACTUS_LOCALSTORAGE.ARRAY_UNE[2]);
    }
    else if (button.id === "flux_monde"){
        showOnly("International");
        setActus(ACTUS_LOCALSTORAGE.ARRAY_MONDE[0], ACTUS_LOCALSTORAGE.ARRAY_MONDE[1], ACTUS_LOCALSTORAGE.ARRAY_MONDE[2]);
    }
    else if (button.id === "flux_sciences"){
        showOnly("Sciences");
        setActus(ACTUS_LOCALSTORAGE.ARRAY_SCIENCES[0], ACTUS_LOCALSTORAGE.ARRAY_SCIENCES[1], ACTUS_LOCALSTORAGE.ARRAY_SCIENCES[2]);
    }
    else{}
}


function showOnly(item){

    const divALL = document.querySelectorAll('.actusDIVALL')

    divALL.forEach(function(divRes){
        let divP = divRes.children[1].children[0].children[0];
        if(divP.innerText === item){
            divRes.style.display = "flex";
        }
        else if(item === "ALl"){
            //ADDED MISSING ELEMENT NOT ADDED ALL ELEMENTS
            divRes.style.display = "flex";
        }
        else{
            divRes.style.display = "none";
        }
    });
}