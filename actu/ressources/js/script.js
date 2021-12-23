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

const header = document.querySelector('.header');
const footer = document.querySelector('.footer');
const content = document.querySelector('.content');
const LastMaj = document.querySelector('.LastMaj');
const refreshActus = document.querySelector('.refreshActus');

//--------------------------------------------------------------------------------------------

window.onload = function (){
    loadActus(setLS);
    // initialFlux();
}

//--------------------------------------------------------------------------------------------

const dateNow = new Date();

function loadActus(callback){
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

                let d = dateRefresh.getDate();
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
            callback();
        }
        else {}
    };
    nghttp.open("GET", "https://stuff.nicolasvaillant.net/local/prive/load/getXML.php", true);
    nghttp.send();
}

let ACTUS_LOCALSTORAGE, ARRAY_UNE_SORT, ARRAY_MONDE_SORT, ARRAY_SCIENCES_SORT;
ARRAY_ACTUS_LOCALSTORAGE = [];
ARRAY_ACTUS_MONDE = [];
ARRAY_ACTUS_UNE = [];
ARRAY_ACTUS_SCIENCES = [];

function setLS(){
    ACTUS_LOCALSTORAGE = JSON.parse(localStorage.getItem(key_a));

    ARRAY_ACTUS_LOCALSTORAGE.push(ACTUS_LOCALSTORAGE);

    ARRAY_UNE_SORT = ARRAY_ACTUS_LOCALSTORAGE[0].ARRAY_UNE[2];
    ARRAY_MONDE_SORT = ARRAY_ACTUS_LOCALSTORAGE[0].ARRAY_MONDE[2];
    ARRAY_SCIENCES_SORT = ARRAY_ACTUS_LOCALSTORAGE[0].ARRAY_SCIENCES[2];

    // console.log(ARRAY_UNE_SORT.sort())

    for(let i = 0 ; i < ARRAY_UNE_SORT.length ; i ++){
        ARRAY_ACTUS_UNE.push(ARRAY_UNE_SORT[i][1]);
    }
    for(let i = 0 ; i < ARRAY_MONDE_SORT.length ; i ++){
        ARRAY_ACTUS_MONDE.push(ARRAY_MONDE_SORT[i][1]);
    }
    for(let i = 0 ; i < ARRAY_SCIENCES_SORT.length ; i ++){
        ARRAY_ACTUS_SCIENCES.push(ARRAY_SCIENCES_SORT[i][1]);
    }

    initialFlux()
}


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

        const divALL = document.createElement("div");
        divALL.classList.add('actusDIVALL');

        //CATEGORIES
        const divClass = document.createElement("div");
        divClass.classList.add('actusDIVClass');
        const divClassTitle = document.createElement("p");
        const divClassTitle_IMG = document.createElement("img");
        divClassTitle_IMG.classList.add('divClassTitle_IMG');

        if (categories === "une") {
            divClass.style.background = "var(--blue)";
            divClass.setAttribute('data-class', "La Une");
            divClassTitle_IMG.src = "icon/fr.png";
        } else if (categories === "monde") {
            divClass.style.background = "#ec6b83";
            divClass.setAttribute('data-class', "International");
            divClassTitle_IMG.src = "icon/world.png";
        } else {
            divClass.style.background = "#6fec6b";
            divClass.setAttribute('data-class', "Sciences");
            divClassTitle_IMG.src = "icon/physic.png";
        }
        // divClass.appendChild(divClassTitle_IMG);
        divClass.appendChild(divClassTitle);

        const ul_collapsible = document.createElement("ul");
        const li_collapsible = document.createElement("li");
        const header_collapsible = document.createElement("div");
        const content_collapsible = document.createElement("div");
        const imgContainer = document.createElement("div");
        const contentContainer = document.createElement("div");
        ul_collapsible.classList.add('actusDIV');
        ul_collapsible.classList.add('collapsible');
        header_collapsible.classList.add('collapsible-header');
        content_collapsible.classList.add('collapsible-body');
        imgContainer.classList.add('imgContainer');
        contentContainer.classList.add('contentContainer');

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

        }else{
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


        const title = document.createElement("p");
        title.classList.add('actusTitle');
        title.innerHTML = tableau[i][0]

        const content_collapsibleContainer = document.createElement("div");
        content_collapsibleContainer.classList.add('content_collapsibleContainer');
        const description = document.createElement("p");
        description.classList.add('actusDescription');
        const asset = document.createElement("div");
        asset.classList.add('asset');
        const i_link = document.createElement("i");
        const a_i_link = document.createElement("a");
        const i_bin = document.createElement("i");
        i_link.classList.add('fas');
        i_link.classList.add('fa-external-link-square-alt');
        i_bin.classList.add('fas');
        i_bin.classList.add('fa-trash-alt');
        a_i_link.appendChild(i_link)
        asset.appendChild(a_i_link);
        asset.appendChild(i_bin);

        i_bin.onclick = function (){removeAll(this)};
        a_i_link.href = tableau[i][3];
        a_i_link.target = "_blank";

        description.innerHTML = tableau[i][2]

        header_collapsible.onclick = function(){collapsibleEvent(this)};

        imgContainer.appendChild(img);
        imgContainer.appendChild(divClass);
        header_collapsible.appendChild(imgContainer);

        contentContainer.appendChild(date);
        contentContainer.appendChild(title);
        header_collapsible.appendChild(contentContainer);

        content_collapsibleContainer.appendChild(description);
        content_collapsibleContainer.appendChild(asset);
        content_collapsible.appendChild(content_collapsibleContainer);

        li_collapsible.appendChild(header_collapsible);
        li_collapsible.appendChild(content_collapsible);
        ul_collapsible.appendChild(li_collapsible);

        divALL.appendChild(ul_collapsible);


        // const Date = divALL.children[0].children[1].textContent.split(",")[1];
        // tabDate.push(Date);

        // div.style.height = 3*(divClass.offsetHeight + img.offsetHeight + 70) + " px";

        // console.log(divClass.offsetHeight + img.offsetHeight + 70)

        divALL.id = "element_" + i;
        content.appendChild(divALL);
    }
    // setActusAnchors(numberActus);
}

function removeAll(div){div.closest('.actusDIVALL').remove()}

function collapsibleEvent(div){
    div.classList.add('showNews');

    if(div.parentElement.classList.contains('active')){
        div.classList.remove('showNews');
    }else{
        div.classList.add('showNews');
    }

    // noinspection JSUnresolvedFunction
    $('.collapsible').collapsible();
}

function scrollIntoViewTOP(){
    window.scrollTo(0,0);
}

function triActus(tabDateIN, order){
    if (order === "AZ"){
        return tabDateIN.sort();
    }else{
        return tabDateIN.sort().reverse();
    }
}

if (document.querySelector('input[name="radio"]')) {
    document.querySelectorAll('input[name="radio"]').forEach((elem) => {
        elem.addEventListener("change", function(event) {
            // console.log(event.target.value)
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
        let divP = divRes.children[0].children[0].children[0].children[0].children[1];
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