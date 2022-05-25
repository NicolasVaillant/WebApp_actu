
// newFlux(createNews, 'une', 'https://www.lefigaro.fr/rss/figaro_photos.xml')

const content_rss_more = document.querySelector('.content_rss_more');

function newFlux(callback, categories = 'others', url = 'https://www.lemonde.fr/rss/une.xml'){
    //----------------------------------------------------------------------------
    //
    // https://www.lemonde.fr/rss/une.xml
    // https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.lemonde.fr%2Frss%2Fune.xml
    // https://rss.com/blog/popular-rss-feeds/
    // https://micromodal.vercel.app/
    //
    //----------------------------------------------------------------------------
    const feedURL = "https://www.lemonde.fr/rss/une.xml"
    // $.ajax({
    //     type: 'GET',
    //     url: "https://www.toptal.com/developers/feed2json/convert?url=" + url,
    //     success: function(result) {
    //         console.log(result)
    //         // if(result.status === 'ok'){result.items.forEach(news => {callback(news, categories)})}
    //     },
    //     error: function (e){
    //         console.log(e)
    //     }
    // });

    const nghttp = new XMLHttpRequest();
    nghttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            const str = this.responseText;
            console.log(str)
        }
    };
    nghttp.open("GET", "https://www.toptal.com/developers/feed2json/convert?url=" + url, true);
    nghttp.setRequestHeader('Content-Type', 'application/xml');
    nghttp.send();

    // fetch("https://api.factmaven.com/xml-to-json?xml=" + url).then(res => res.json())

}


function createNews(news, categories){

    const titleNews = news.title;

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
    } else if (categories === "sciences") {
        divClass.setAttribute('data-color', "#6fec6b");
        divClass.style.background = "#6fec6b";
        divClass.style.border = "2px solid #6fec6b";
        divClass.setAttribute('data-class', "Sciences");
        divClassTitle_IMG.src = "icon/physic.png";
    } else {
        divClass.setAttribute('data-color', "#e77433");
        divClass.style.background = "#e77433";
        divClass.style.border = "2px solid #e77433";
        divClass.setAttribute('data-class', "others");

        divClassTitle_IMG.src = "";

    }
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
    img.src = news.enclosure.link;

    const date = document.createElement("p");
    date.classList.add('actusDate');
    date.innerHTML = news.pubDate;

    const title = document.createElement("p");
    title.classList.add('actusTitle');
    title.innerHTML = titleNews;

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

    i_bin.onclick = function () {removeAll(this)};

    a_i_link.href = news.link;
    a_i_link.target = "_blank";

    description.innerHTML = news.description;

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

    li_collapsible.appendChild(header_collapsible);
    li_collapsible.appendChild(content_collapsible);
    ul_collapsible.appendChild(li_collapsible);

    divALL.appendChild(ul_collapsible);

    // divALL.id = "element_" + i;
    news_u_r.appendChild(divALL);

    // findDuplicate();
}