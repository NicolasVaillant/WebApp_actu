const tabDate = [];
const AR_UNE = [];
const AR_MONDE = [];
const AR_SCIENCES = [];

const AR_UNE_CONTENT = [];
const AR_MONDE_CONTENT = [];
const AR_SCIENCES_CONTENT = [];

//--------------------------------------------------------------------------------------------

const key_a ="ArrayALL";
const key_blacklist ="blacklist_news";

//--------------------------------------------------------------------------------------------

const value = triActus(tabDate, "AZ"); // ZA

const header = document.querySelector('.header');
const footer = document.querySelector('.footer');
const content = document.querySelector('.content');
const news_u_r = document.querySelector('.news-u-r');
const news_r = document.querySelector('.news-r');
const LastMaj = document.querySelector('.LastMaj');
const refreshActus = document.querySelector('.refreshActus');

//--------------------------------------------------------------------------------------------

window.onload = function (){
    loadActus(setLS);
    collapsibleEvent();
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
        document.querySelector('.n-u-r').classList.add('hiddenElement');
    }else{
        console.error('Empty tab');
    }
    return true;
}

function setActus(maj, categories, tableau) {

    //REMOVE ALL CHILD ELEMENTS BEFORE ADDED IT
    const news_u_r = document.querySelector('.news-u-r');
    const news_r = document.querySelector('.news-r');

    while (news_u_r.firstChild) {
        news_u_r.removeChild(news_u_r.lastChild);
    }
    while (news_r.firstChild) {
        news_r.removeChild(news_r.lastChild);
    }

    let numberActus = 10;

    let arrayDateToSort;
    let arrayHourToSort;
    let diffTime;

    let det = [
        "ce", "cet", "cette", "mon", "ton", "son", "notre", "votre", "leur", "quelque",
        "certain", "un", "quel", "quelle", "ces", "mes", "tes", "ses", "nos", "vos", "leurs",
        "quelques", "certains", "certaines", "quels", "quelles", "le", "la", "l'", "une",
        "du", "de", "de", "la", "les", "des", "dans", "en", "par", "et", "pour", "a", "à", "au", "aux", "sur", ":",
        "avec"
    ];


    let arrayAllLinks;
    let arrayAllLinks_num;
    let arrayAllLinks_element;
    let blacklist;
    let n_blacklist;
    for (let i = 0; i < numberActus; i++) {

        const news_u_r = document.querySelector('.news-u-r');

        const divALL = document.createElement("div");
        divALL.classList.add('actusDIVALL');
        divALL.setAttribute('data-state', 'unread');

        //CATEGORIES
        const divClass = document.createElement("div");
        divClass.classList.add('actusDIVClass');
        const divClassTitle = document.createElement("p");
        const divClassTitle_IMG = document.createElement("img");
        divClassTitle_IMG.classList.add('divClassTitle_IMG');

        if (categories === "une") {
            divClass.setAttribute('data-color', "var(--blue)");
            divClass.style.background = "var(--blue)";
            divClass.style.border = "2px solid var(--blue)";
            divClass.setAttribute('data-class', "La Une");
            divClassTitle_IMG.src = "icon/fr.png";
        } else if (categories === "monde") {
            divClass.setAttribute('data-color', "#ec6b83");
            divClass.style.background = "#ec6b83";
            divClass.style.border = "2px solid #ec6b83";
            divClass.setAttribute('data-class', "International");
            divClassTitle_IMG.src = "icon/world.png";
        } else {
            divClass.setAttribute('data-color', "#6fec6b");
            divClass.style.background = "#6fec6b";
            divClass.style.border = "2px solid #6fec6b";
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

        let y = dateNow.getFullYear();
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


        if (tableau[i][1].includes(y)) {
            arrayDateToSort.push(tableau[i][1].split(y)[0].split(", ")[1].substring(0, 2));
            arrayDateToSort.push(d);
            arrayHourToSort.push(tableau[i][1].split(y)[1].split(" +")[0]);
            arrayHourToSort.push(h + ":" + m + ":" + s);

            if (arrayDateToSort[1] !== Number(arrayDateToSort[0])) {
                diffTime = 24 - parseInt(arrayHourToSort[0]) + parseInt(arrayHourToSort[1]);

                date.innerHTML = tableau[i][1].split("+")[0] + " • " + " il y a " + diffTime + " heures";

                if (diffTime > 24) {
                    date.innerHTML = tableau[i][1].split("+")[0] + " • " + " il y a plus d'un jour";
                } else {
                    date.innerHTML = tableau[i][1].split("+")[0] + " • " + " il y a " + diffTime + " heures";
                }
            } else {
                diffTime = Math.abs(parseInt(arrayHourToSort[1]) - parseInt(arrayHourToSort[0]));

                // console.log(i, diffTime)

                if (diffTime < 1) {
                    date.innerHTML = tableau[i][1].split("+")[0] + " • " + " il y a moins d'une heure";
                } else if (diffTime === 1) {
                    date.innerHTML = tableau[i][1].split("+")[0] + " • " + " il y a " + diffTime + " heure";
                } else {
                    date.innerHTML = tableau[i][1].split("+")[0] + " • " + " il y a " + diffTime + " heures";
                }
            }
        } else {
            date.innerHTML = tableau[i][1].split("+")[0];
        }

        // date.innerHTML = i;

        const title = document.createElement("p");
        title.classList.add('actusTitle');
        let txt_title = "Emmanuel Macron qui a recu présidentielle"
        // title.innerHTML = txt_title;
        title.innerHTML = tableau[i][0]

        const content_collapsibleContainer = document.createElement("div");
        content_collapsibleContainer.classList.add('content_collapsibleContainer');
        const title_others = document.createElement("p");
        const content_others = document.createElement("div");
        const blank_others = document.createElement("a");
        const i_blank_others = document.createElement("i");
        const link_article = document.createElement("div");
        const description = document.createElement("p");
        description.classList.add('actusDescription');
        const asset = document.createElement("div");
        asset.classList.add('asset');
        const i_link = document.createElement("i");
        const a_i_link = document.createElement("a");
        const i_improve = document.createElement("i");
        const i_bin = document.createElement("i");

        const div_ext = document.createElement('div');
        div_ext.classList.add('div_ext');
        const div_in = document.createElement('div');
        div_in.classList.add('div_in');

        content_others.classList.add('content_others');
        i_link.classList.add('fas');
        i_link.classList.add('fa-external-link-square-alt');
        i_bin.classList.add('fas');
        i_bin.classList.add('fa-trash-alt');
        i_blank_others.classList.add('fas');
        i_blank_others.classList.add('fa-external-link-square-alt');
        i_improve.classList.add('fas');
        i_improve.classList.add('fa-meteor');
        i_improve.onclick = function () {
            improve_selection(this, true)
        }
        a_i_link.appendChild(i_link)
        asset.appendChild(a_i_link);
        asset.appendChild(i_bin);

        i_bin.onclick = function () {
            removeAll(this)
        };
        a_i_link.href = tableau[i][3];
        a_i_link.target = "_blank";

        description.innerHTML = tableau[i][2]

        header_collapsible.onclick = function () {
            collapsibleEvent(this);
            toggleState(this)
        };

        imgContainer.appendChild(img);
        imgContainer.appendChild(divClass);
        header_collapsible.appendChild(imgContainer);

        contentContainer.appendChild(date);
        contentContainer.appendChild(title);
        header_collapsible.appendChild(contentContainer);

        content_collapsibleContainer.appendChild(description);
        content_collapsibleContainer.appendChild(asset);
        content_collapsible.appendChild(content_collapsibleContainer);

        arrayAllLinks = [];
        arrayAllLinks_num = [];
        arrayAllLinks_element = [];
        n_blacklist = [];
        blacklist = JSON.parse(localStorage.getItem(key_blacklist));

        if (blacklist === undefined || blacklist === null) {}else{
            n_blacklist.push(blacklist.toString().split(","))
        }

        tableau[i][0].split(" ").forEach(child => {
        // txt_title.split(" ").forEach(child => {
            // console.log(child.split(":"))
            for (let a = i; a < 10; a++) {
                // if (tableau[a][0].split(" ").includes(child)) {
                if (txt_title.split(" ").includes(child)) {
                    if (blacklist === undefined || blacklist === null) {
                        if (det.includes(child.toLowerCase())) {
                        } else {
                            if (a !== i) {
                                createSpan(
                                    child, a, link_article,
                                    title_others, content_others,
                                    blank_others, i_blank_others,
                                    i_improve, content_collapsible, div_ext, div_in, i)
                            }
                        }
                    } else {
                        if (det.includes(child.toLowerCase()) || n_blacklist[0].includes(child)) {
                        } else {
                            if (a !== i) {
                                createSpan(
                                    child, a, link_article,
                                    title_others, content_others,
                                    blank_others, i_blank_others,
                                    i_improve, content_collapsible, div_ext, div_in, i)
                            }
                        }
                    }
                }
            }
            for (let a = i; a >= 0; a--) {
                if (tableau[a][0].split(" ").includes(child)) {
                    if (blacklist === undefined || blacklist === null) {
                        if (det.includes(child.toLowerCase())) {
                        } else {
                            if (a !== i) {
                                createSpan(
                                    child, a, link_article,
                                    title_others, content_others,
                                    blank_others, i_blank_others,
                                    i_improve, content_collapsible, div_ext, div_in, i)
                            }
                        }
                    } else {
                        if (det.includes(child.toLowerCase()) || n_blacklist[0].includes(child)) {
                        } else {
                            if (a !== i) {
                                createSpan(
                                    child, a, link_article,
                                    title_others, content_others,
                                    blank_others, i_blank_others,
                                    i_improve, content_collapsible, div_ext, div_in, i)
                            }
                        }
                    }
                }
            }
        })

        li_collapsible.appendChild(header_collapsible);
        li_collapsible.appendChild(content_collapsible);
        ul_collapsible.appendChild(li_collapsible);

        divALL.appendChild(ul_collapsible);

        divALL.id = "element_" + i;

        news_u_r.appendChild(divALL);

    }
    findDuplicate();
}



document.querySelectorAll('.input__selector').forEach(e => {e.onclick = function (){checkIfChecked(e)}})

function checkIfChecked(e){
    const label = e.closest('label');
    // console.log(label)
    if(e.checked === true){
        label.classList.add('input__selector__checked')
    }else{
        label.classList.remove('input__selector__checked')
    }
}

function addChannel(){
    MicroModal.show('modal-1');
}

function closeModal(){
    MicroModal.close('modal-1');
    addFlux();
}

function addFlux(){
    const container = document.createElement('DIV');
    container.classList.add('expand_flex');
    container.onclick = function (){changeFlux(this)}

    const label = document.createElement('LABEL');
    label.classList.add('e');
    label.innerText = "ok"
    const input = document.createElement('INPUT');
    input.classList.add('e');
    input.setAttribute('type', 'radio');
    input.setAttribute('value', "ok");

    content_rss_more.appendChild(container)
}

function changeTabs(e, index){
    document.querySelectorAll('.tab__content').forEach(e => {e.style.display = "none"})
    document.querySelectorAll('.tab__link').forEach(e => {e.classList.remove('active')})

    document.getElementById(index).style.display = "flex";
    e.classList.add('active');
}

let child_value = [];
let index_value = [];
let array_stocked_all = [];

function createSpan(child, a, link_article, title_others, content_others,
                    blank_others, i_blank_others, i_improve, content_collapsible, div_ext, div_in, i){
    link_article.classList.add('link_article');
    title_others.innerHTML = "Plus d'articles en lien avec ";
    const span = document.createElement('span');
    span.classList.add('span_link');

    span.innerHTML = child;

    span.onclick = function () {see_link_article(this, a)}
    span.setAttribute('data-click', a)

    const span_close = document.createElement('span');

    const i_close = document.createElement('i');
    span_close.classList.add('span_close');
    i_close.classList.add('fas');
    i_close.classList.add('fa-minus');
    span_close.appendChild(i_close);
    span.appendChild(span_close);

    content_others.appendChild(span);

    if(content_others.childElementCount > 3){
        div_in.classList.add('flexC');
        div_in.classList.add('flexStart');
        link_article.classList.add('flexC');
        link_article.classList.add('flexStart');
    }

    blank_others.innerHTML = "Google Actualités : " + child;
    blank_others.href = "https://news.google.com/search?q=" + child;
    blank_others.target = "_blank";

    // if (content_others.childElementCount > 4) {return}

    div_in.appendChild(title_others);
    div_in.appendChild(content_others);

    link_article.appendChild(div_in);

    blank_others.appendChild(i_blank_others);

    div_ext.appendChild(blank_others);
    div_ext.appendChild(i_improve);

    link_article.appendChild(div_ext);
    content_collapsible.appendChild(link_article);
}

let array_o = [];
let array_o_i = [];

function findDuplicate(){
    const actusDIVALL = document.querySelectorAll('.actusDIVALL');

    actusDIVALL.forEach(e => {
        let ar = [];
        const span = e.querySelectorAll('.span_link');
        if(span !== null){

            for (let i = 0; i < span.length; i++) {ar.push(span[i].innerText)}

            const count = {};
            const result = [];

            // console.log(ar)

            ar.forEach(item => {
                if (count[item]) {
                    count[item] +=1
                    return
                }
                count[item] = 1
            })

            for (let prop in count){
                if (count[prop] >=2){
                    result.push(prop)
                }
            }
            array_o.push(result);
        }

    })

    for (let i = 0; i < array_o.length; i++) {
        if(array_o[i].length !== 0){
            array_o_i.push(i)
        }
    }
    // console.log(array_o)    //value
    // console.log(array_o_i)  //index

    for(let i = 0; i < array_o.length - 1; i++){
        if(array_o[i].length !== 0){
            array_o[i].forEach(e => {

                // console.log(e)

                const assemblyDiv = document.createElement('div');
                const assemblyDiv_tooltip = document.createElement('div');
                const assemblyDiv_label = document.createElement('p');
                assemblyDiv.classList.add('assemblyDiv');
                assemblyDiv_tooltip.classList.add('assemblyDiv_tooltip');
                assemblyDiv_label.classList.add('assemblyDiv_label');
                const i_plus = document.createElement('i');
                i_plus.classList.add('fas');
                i_plus.classList.add('fa-plus-circle');

                let counter_nb_child = 0;

                const span_close = document.createElement('span');
                const i_close = document.createElement('i');
                span_close.classList.add('span_close');
                i_close.classList.add('fas');
                i_close.classList.add('fa-minus');

                // console.log(actusDIVALL[i])
                // console.log(actusDIVALL[i].querySelectorAll('.span_link'))

                if(actusDIVALL[i] !== undefined){
                    actusDIVALL[i].querySelectorAll('.span_link').forEach(ee => {

                        // console.log(ee)

                        if(ee.innerText === e){

                            //ee : span
                            //e : value txt

                            assemblyDiv_label.innerText = e;
                            assemblyDiv_label.appendChild(i_plus)

                            const clone = ee.cloneNode(true);
                            clone.classList.add('cloneNewsHidden');

                            span_close.appendChild(i_close);

                            const i_red = document.createElement('i');
                            i_red.classList.add('fas');
                            i_red.classList.add('fa-arrow-alt-circle-right');

                            const redirect = document.createElement('div');
                            const redirect_p = document.createElement('p');
                            redirect_p.innerText = clone.dataset.click;
                            redirect.classList.add('redirection_plus');

                            redirect.appendChild(redirect_p);
                            redirect.appendChild(i_red);
                            assemblyDiv_label.appendChild(span_close);
                            clone.appendChild(redirect);

                            clone.onclick = function () {see_link_article(this, clone.dataset.click)}

                            assemblyDiv_tooltip.appendChild(clone);
                            assemblyDiv.appendChild(assemblyDiv_tooltip);
                            assemblyDiv.appendChild(assemblyDiv_label);
                            // assemblyDiv.appendChild(span_close);


                            assemblyDiv_label.onclick = function (){
                                if(assemblyDiv_label.classList.contains('edition_plus')){
                                    deleteSpanLink(assemblyDiv_label);
                                }else{
                                    // assemblyDiv_tooltip.classList.toggle('show_tooltip');

                                    if(assemblyDiv_tooltip.classList.contains('show_tooltip')){
                                        assemblyDiv_label.classList.remove('assemblyDiv_label_on')
                                        assemblyDiv_tooltip.classList.remove('show_tooltip');
                                    }else{
                                        document.querySelectorAll('.assemblyDiv_tooltip').forEach(el => {
                                            el.classList.remove('show_tooltip');
                                        })
                                        document.querySelectorAll('.assemblyDiv_label').forEach(el => {
                                            el.classList.remove('assemblyDiv_label_on');
                                        })
                                        assemblyDiv_tooltip.classList.add('show_tooltip');
                                        assemblyDiv_label.classList.add('assemblyDiv_label_on');
                                    }
                                }

                            }
                            ee.classList.add('hiddenElement');
                            ee.closest('.content_others').appendChild(assemblyDiv);
                        }
                    })
                }
            })
        }
    }
}

function tes(){
    var arr1 = ["Quote1", "Quote2", "Quote3"];
    var arr2 = ["Author1", "Author2", "Author3"];

// the output I need to achieve:
//[ ["Quote1", "Author1"], ["Quote2", "Author2"], ["Quote3", "Author3"] ];


}


function improve_selection(div, flag){
    const div_span = div.closest('.link_article').querySelector('.content_others');
    const span = div_span.querySelectorAll(".span_link:not(.cloneNewsHidden):not(.hiddenElement )");
    const span_plus = div_span.querySelectorAll(".assemblyDiv_label");


    // div_span.classList.toggle('edition');
    if(flag === true){
        if(span.length === 0){
            for(let i = 0 ; i < span_plus.length ; i++){
                console.log("ok")
                span_plus[i].classList.add('edition_color');
                span_plus[i].classList.add('border_span');
                span_plus[i].classList.add('edition_plus');
                // console.log(span_plus[i])
                span_plus[i].querySelectorAll('.span_close').forEach(close =>{
                    close.classList.add('edition_close');
                })
            }
            // findDuplicate();
        }else{
            for(let i = 0 ; i < span.length ; i++){
                span[i].classList.add('edition_color');
                span[i].classList.add('border_span');
                span[i].classList.add('edition');
                span[i].querySelectorAll('.span_close').forEach(close =>{
                    close.classList.add('edition_close');
                })
            }
        }

    }else{
        if(span.length === 0){
            for(let i = 0 ; i < span_plus.length ; i++){
                span_plus[i].classList.remove('edition_color');
                span_plus[i].classList.remove('border_span');
                span_plus[i].classList.remove('edition_plus');
                span_plus[i].querySelectorAll('.span_close').forEach(close =>{
                    close.classList.remove('edition_close');
                })
            }
            // findDuplicate();
        }else{
            for(let i = 0 ; i < span.length ; i++){
                span[i].classList.remove('edition_color');
                span[i].classList.remove('border_span');
                span[i].classList.remove('edition');
                span[i].querySelectorAll('.span_close').forEach(close =>{
                    close.classList.remove('edition_close');
                })
            }
        }
    }

}

function see_link_article(div, e){
    let selector = ("#element_" + e).toString();

    if(div.classList.contains('edition')){
        // console.log(div.innerText)
        deleteSpanLink(div);
    }else{
        document.querySelector(selector).scrollIntoView();
        setTimeout(function (){
            document.querySelector(selector).querySelector('li').classList.add('highlight');
            setTimeout(function (){
                document.querySelector(selector).querySelector('li').classList.remove('highlight')
            },1000)
        }, 1000)
    }
}

function deleteSpanLink(div){
    Swal.fire({
        title: `Etes-vous sur de vouloir supprimer "${div.innerText}" des suggestions ?`,
        text: "L'action est irréversible.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Supprimer',
        cancelButtonText: 'Annuler'
    }).then((result) => {
        let blacklist;
        if (result.isConfirmed) {
            Swal.fire(
                'Supprimé',
                `Le mot "${div.innerText}" a bien été supprimé des suggestions.`,
                'success'
            )

            if (div.closest('.content_others').childElementCount !== 1) {
                if(div.classList.contains('.assemblyDiv_label')){
                    div.closest('.assemblyDiv').remove()
                }else{
                    div.remove();
                }
            } else {
                div.closest('.link_article').remove();
            }

            let array_blacklist = [];
            blacklist = JSON.parse(localStorage.getItem(key_blacklist));

            // console.log(blacklist.toString())

            if(blacklist === undefined || blacklist === null){
                array_blacklist.push(div.innerText)
                localStorage.setItem(key_blacklist, JSON.stringify(array_blacklist));
            }else{
                array_blacklist.push(blacklist.toString(), div.innerText);
                // array_blacklist.push(div.innerText);
                // console.log(array_blacklist)
                localStorage.setItem(key_blacklist, JSON.stringify(array_blacklist));
            }
            // console.log(array_blacklist)

        }
    })
    improve_selection(div)
}

function removeAll(div){div.closest('.actusDIVALL').remove()}

function collapsibleEvent(div, flag){

    if(flag === "filter"){

    }else{
        if(div !== undefined) {
            div.classList.add('showNews');
            if (div.parentElement.classList.contains('active')) {
                div.classList.remove('showNews');
            } else {
                div.classList.add('showNews');
            }
        }
    }


    if(div){
        // console.log(div)
        div.closest('.actusDIV').querySelectorAll('.assemblyDiv_tooltip').forEach(e => {
            e.classList.remove('show_tooltip')
        })
        div.closest('.actusDIV').querySelectorAll('.assemblyDiv_label').forEach(e => {
            e.classList.remove('assemblyDiv_label_on')
        })
    }


    // noinspection JSUnresolvedFunction
    $('.collapsible').collapsible();
}

let counter_read = 0;

function toggleState(div){

    const divAll = div.closest('.actusDIVALL');
    div.querySelector('.actusDIVClass').style.background = "var(--w)";

    if(divAll.dataset.state === "unread"){
        const clone = divAll.cloneNode(true);
        news_r.appendChild(clone);
        if(news_r.childElementCount !== 0){
            document.querySelector('.n-r').classList.add('hiddenElement');
        }
        divAll.setAttribute('data-state', 'read');
    }

    // backup(divAll);

    const txt = "Tips : Si un mot suggéré est inaproprié, supprimez-le de la liste de suggestion en cliquant sur : ";
    showTips(divAll, txt, true, "link");
}


function changeFilter(input){
    const actusDIVALL = document.querySelectorAll('.actusDIVALL')

    if(input.id === "r"){
        actusDIVALL.forEach(e => {
            if(e.dataset.state === "unread"){e.style.display = "flex"}else{e.style.display = "none"}
        })
    }else{
        actusDIVALL.forEach(e => {
            if(e.dataset.state === "read"){e.style.display = "flex"}else{e.style.display = "none"}
        })
    }
    if(news_r.childElementCount !== 0){
        document.querySelector('.n-r').classList.add('hiddenElement');
    }
}


function backup(div){


    const array_state = [];
    const array_state_all = [];

    if(content.childElementCount !== 0){
        for(let i = 1 ; i <= content.childElementCount - 1; i++) {
            // console.log(content.children[i])
            array_state.push(
                content.children[i].dataset,
                content.children[i].id
            )
            array_state_all.push(array_state.splice(0, array_state.length))
        }
        // console.log(array_state_all)
    }
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

const filter_r = document.querySelector('#filter_r')
const selectedNews = document.querySelector('.selectedNews')

selectedNews.addEventListener('click', () => {
    const txt = "Tips : Vous pouvez aussi afficher uniquement les actualités non-lues dans les dernières actualités !";
    showTips(null, txt, false, false, 80000);
}, {once : true})

filter_r.addEventListener('click', () => {
    const actusDIVALL = document.querySelector('.news-u-r').querySelectorAll('.actusDIVALL');
    if(filter_r.checked === true){
        actusDIVALL.forEach(e => {
            if(e.dataset.state === "read"){
                e.classList.add('hiddenElement');
            }else{
                e.classList.remove('hiddenElement');
            }
        })
    }else{
        actusDIVALL.forEach(e => {e.classList.remove('hiddenElement')})
    }
})

function changeFlux(button){
    let array_child = [];
    array_o_i = [];
    array_o = [];
    let newArr = [];

    expandFlex(button);

    if(button.id === "flux_une"){
        showOnly("La Une");

        setActus(ACTUS_LOCALSTORAGE.ARRAY_UNE[0], ACTUS_LOCALSTORAGE.ARRAY_UNE[1], ACTUS_LOCALSTORAGE.ARRAY_UNE[2]);
        if(news_r.childElementCount === 0) {
            document.querySelector('.n-r').classList.remove('hiddenElement');
        }
    }
    else if (button.id === "flux_monde"){
        showOnly("International");
        setActus(ACTUS_LOCALSTORAGE.ARRAY_MONDE[0], ACTUS_LOCALSTORAGE.ARRAY_MONDE[1], ACTUS_LOCALSTORAGE.ARRAY_MONDE[2]);
        if(news_r.childElementCount === 0) {
            document.querySelector('.n-r').classList.remove('hiddenElement');
        }
    }
    else if (button.id === "flux_sciences"){
        showOnly("Sciences");
        setActus(ACTUS_LOCALSTORAGE.ARRAY_SCIENCES[0], ACTUS_LOCALSTORAGE.ARRAY_SCIENCES[1], ACTUS_LOCALSTORAGE.ARRAY_SCIENCES[2]);
        if(news_r.childElementCount === 0) {
            document.querySelector('.n-r').classList.remove('hiddenElement');
        }
    }
    else{}
}

function expandFlex(item){
    const flux_une = document.querySelector('#flux_une');
    const flux_monde = document.querySelector('#flux_monde');
    const flux_sciences = document.querySelector('#flux_sciences');

    flux_une.classList.remove('expand_flex');
    flux_monde.classList.remove('expand_flex');
    flux_sciences.classList.remove('expand_flex');

    item.classList.add('expand_flex');
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

let counter = 0;
function showTips(div, txt, icon, flag, time){

    const myToast = Toastify({
        text: txt,
        duration: time || 5000,
        close: icon,
        avatar: "/icon/stars.png"
    })

    if(flag === "link"){
        if(div.querySelector('.link_article') !== null){
            if(div.querySelector('li.active')){}else{
                counter++;
                if(counter%2 === 0){
                    myToast.showToast();
                    counter = 0;
                }
            }
        }
    }else{myToast.showToast();}
}
