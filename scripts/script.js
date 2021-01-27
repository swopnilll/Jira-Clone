window.onload = function(){

    init();
    initDrag();
    initSelect();
    
    function initDrag(){
        var list = document.getElementsByClassName('main-container'),
            block = document.getElementsByClassName('block'),
            blockHeight = block[0].clientHeight;
    
        for ( var i = 0; i < list.length; i++){
            list[i].setAttribute('ondrop', 'drop(this, event)');
            list[i].setAttribute('ondragenter', 'return false');
            list[i].setAttribute('ondragover', 'return false');
            list[i].setAttribute("style", "height: " + (blockHeight * 4 + 80) + "px;")
        }
        for ( var i = 0; i < block.length; i++){
            block[i].setAttribute('draggable', 'true');
            block[i].setAttribute('ondragstart', 'drag(this, event)');
        }
    }
}

function createBlock(){
    var backlog = document.getElementById("backlog"),
        i_container = document.getElementById("create-issue-container"),
        i_main = document.getElementById("create-issue"),
        type = document.getElementsByName("issue-type")[0].value,
        summary = document.getElementsByName("summary")[0].value,
        priority = document.getElementsByName("priority")[0].value,
        description = document.getElementsByName("description")[0].value,
        reporter = document.getElementsByName("reporter")[0].value,
        assignees = document.getElementsByName("assignees")[0].value;

    if ( ! ( summary && description && reporter && assignees && type && priority) ){
        alert("Please fill all of the fields!");
        return 1;
    }
    var newBlock = document.createElement("div");
    newBlock.classList.add("block");
    newBlock.setAttribute('draggable', 'true');
    newBlock.setAttribute('ondragstart', 'drag(this, event)');
    
    newBlock.innerHTML = summary;

    newBlock.appendChild(createData("summary", summary));
    newBlock.appendChild(createData("priority", priority));
    newBlock.appendChild(createData("type", type));
    newBlock.appendChild(createData("description", description));
    newBlock.appendChild(createData("reporter", reporter));
    newBlock.appendChild(createData("assignees", assignees));

    i_container.setAttribute("style", "display: none;");
    i_main.setAttribute("style", "display: none;");
    newBlock.addEventListener("click", blockClick);
    backlog.appendChild(newBlock);
    checkHeight()
}

function createData(name, value){
    var data=document.createElement("data");
    data.value = name;
    data.style.display = "none";
    data.innerHTML = value;
    return data;
}

function init(){
    var clear = document.getElementById("cancel"),
        submit = document.getElementById("submit"),
        show_i = document.getElementById("show_i"),
        i_container = document.getElementById("create-issue-container"),
        i_main = document.getElementById("create-issue"),
        block_window = document.getElementById("block-click-box"),
        block = document.getElementsByClassName("block");
    
    for (var i = 0; i < block.length; i++){
        block[i].addEventListener("click", blockClick);
    }
    submit.addEventListener("click", function(){createBlock();});
    show_i.addEventListener("click", function(){
        i_container.setAttribute("style", "display: block;");
        i_main.setAttribute("style", "display: block;");
    });
    i_container.addEventListener("click", function(){
        i_container.classList.add("hide")
        i_main.classList.add("hide")
        block_window.classList.add("hide")
        setTimeout(function(){
            i_container.setAttribute("style", "display: none;");
            i_main.setAttribute("style", "display: none;");
            block_window.setAttribute("style", "display: none;");
            i_container.classList.remove("hide");
            i_main.classList.remove("hide");
            block_window.classList.remove("hide");
        }, 500);
        retractAllDropdowns();
    });
    clear.addEventListener("click", function(){
        i_container.setAttribute("style", "display: none;");
        i_main.setAttribute("style", "display: none;");
    });
}

var elements = [];

function checkHeight(){
    var containers = document.getElementsByClassName("main-container"),
        child = 0,
        blockHeight = document.getElementsByClassName('block')[0].offsetHeight;
    for (var i = 0; i < containers.length; i++){
        if ( containers[i].childElementCount > child ){
            child = containers[i].childElementCount;
        }
    }
    var totalBlockHeight = blockHeight * (child - 1) + child * 10 + 30;
    for (var i = 0; i < containers.length; i++){
        if ( child >= 5 )
            containers[i].setAttribute("style", "height: " + (totalBlockHeight) + 'px');
    }
}

function drag(element, event) {
    var index = elements.indexOf(element),
        parent = elements.indexOf(element.parentElement);
    if (index == -1) {
        elements.push(element);
        index = elements.length - 1;
    }
    if (parent == -1) {
        elements.push(element.parentElement)
        parent = elements.length - 1;
    }
    event.dataTransfer.setData('index', index);
    event.dataTransfer.setData('parent', parent);
}

function drop(target, event) {
    var element = elements[event.dataTransfer.getData('index')],
        parent = elements[event.dataTransfer.getData('parent')];
    if (parent != target){
        if ( target.childElementCount < 80){
            target.appendChild(element);
            return checkHeight(parent)
        } else {
            alert("The maximum number of blocks for a single container is 7!")
            return false;
        }
    }
}

function getData(block, value){
    return block.querySelector("data[value=" + value + "]").innerHTML || " ";
}

function blockClick(){
    var i_container = document.getElementById("create-issue-container"),
        block_window = document.getElementById("block-click-box")
        box = document.getElementById("main-block-box");

    var description = getData(this, "description"),
        priority = getData(this, "priority"),
        reporter = getData(this, "reporter"),
        assignees = getData(this, "assignees"),
        summary = getData(this, "summary"),
        type = getData(this, "type");

    i_container.setAttribute("style", "display: block;");
    block_window.setAttribute("style", "display: block;");

    box.innerHTML = ""
    var pstyle, istyle, rep, assi;
    switch(priority){
        case "high":
            pstyle = "background: red; color: white;";
            break;
        case "medium":
            pstyle = "background: yellow; color: white;";
            break;
        case "low":
            pstyle = "background: green; color: white;";
            break;
    }
    switch(type){
        case "bug":
            istyle = "background: red; color: white;";
            break;
        case "story":
            istyle = "background: yellow; color: white;";
            break;
        case "task":
            istyle = "background: green; color: white;";
            break;
    }
    assi = getIcon(assignees);
    rep = getIcon(reporter);
    createHeader("Issue Type: <span class=\"block-value left-30\" style=\"text-transform: capitalize;"+ istyle +"\">" + type + "</span>", box, true);
    createHeader("Priority: <span class=\"block-value left-30\" style=\"text-transform: capitalize;"+ pstyle +"\">" + priority + "( Tap To Change ) </span>", box, true);
    createHeader("Summary: <span class=\"block-value\" style=\"display: block;\">" + summary + "</span>", box, true);
    createHeader("Description:<br> <span class=\"block-value\" style=\"display: block;\">" + description + "</span>", box, true);
    createHeader("Reporter: <span class=\"block-value user left-30\" style=\"text-transform: capitalize;\">" + reporter + rep +"</span>", box, true);
    createHeader("Assignees: <span class=\"block-value user left-30\" style=\"text-transform: capitalize;\">" + assignees + assi + "</span>", box, true);
}

function getIcon(reporter){
    var rep;
    switch(reporter){
        case "you":
            rep = "<span class=\"avatar-you-icon right\"></span>";
            break;
        case "me":
            rep = "<span class=\"avatar-me-icon right\"></span>";
            break;
        case "else":
            rep = "<span class=\"avatar-else-icon right\"></span>";
            break;
    }
    return rep;
}

function createHeader(html, parent, nl){
    var el = document.createElement("span");

    el.classList.add("block-box-header");
    el.innerHTML = html;
    parent.appendChild(el);
    if (nl){
        parent.appendChild(document.createElement("br"));
    }
}

/*

<data style="display: none;" value="description">This is where the description is gonna be.</data>
<data style="display: none;" value="priority">high</data>
<data style="display: none;" value="reporter">me</data>
<data style="display: none;" value="assignees">you</data>
<data style="display: none;" value="summary">This is where the summary is gonna be that's gonna be shown when you tap on the block.</data>
<data style="display: none;" value="type">Story</data>
*/