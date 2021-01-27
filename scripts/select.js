function initSelect(){
    var select = document.querySelectorAll("div.select");

    for (var i = 0; i < select.length; i++){
        select[i].querySelector(".select-title").addEventListener("click", expandDropdown);
        var options = select[i].querySelectorAll("span.option");
        for (var j = 0; j < options.length; j++){
            options[j].addEventListener("click", clickOption);
        }
    }
}

function defaultSelect(select){
    select.removeEventListener("click", retractDropdown);
    select.addEventListener("click", expandDropdown);
}

function clickOption(){
    var title = this.parentElement.parentElement.querySelectorAll(".select-title span")[1];
    if ( title.innerHTML != this.innerHTML ){
        this.parentElement.parentElement.querySelector("input").value = this.getAttribute("data");
        title.innerHTML = this.innerHTML;
    }
    this.parentElement.parentElement.querySelector("div.dropdown").style.display = "none";
    this.parentElement.parentElement.querySelector("div.dropdown").style.height = "0";
    var arrow = this.parentElement.parentElement.querySelector('.dropuparrow') || this.parentElement.parentElement.querySelector('.dropdownarrow');
    arrow.classList.toggle('dropdownarrow');
    arrow.classList.toggle('dropuparrow');
    defaultSelect(title.parentElement);
}

function retractAllDropdowns(){
    var dropdowns = document.querySelectorAll(".select div.dropdown");

    for ( var i = 0; i < dropdowns.length; i++){
        dropdowns[i].style.display = "none";
        dropdowns[i].style.height = "0";
    }
    defaultAllDropdowns();
}

function defaultAllDropdowns(){
    var select = document.querySelectorAll("div.select");
    for ( var i = 0; i < select.length; i++){
        select[i].querySelector(".select-title").removeEventListener("click", expandDropdown);
        select[i].querySelector(".select-title").removeEventListener("click", retractDropdown);
        select[i].querySelector(".select-title").addEventListener("click", expandDropdown);
    }
}

function retractDropdown(){
    this.parentElement.querySelector("div.dropdown").style.display = "none";
    this.parentElement.querySelector("div.dropdown").style.height = "0";
    var arrow = this.parentElement.querySelector('.dropuparrow') || this.parentElement.querySelector('.dropdownarrow');
    arrow.classList.toggle('dropdownarrow');
    arrow.classList.toggle('dropuparrow');
    defaultSelect(this);
}

function expandDropdown(){
    retractAllDropdowns();
    this.parentElement.querySelector("div.dropdown").style.display = "block";
    this.parentElement.querySelector("div.dropdown").style.height = "100%";

    var arrow = this.parentElement.querySelector('.dropuparrow') || this.parentElement.querySelector('.dropdownarrow');
    arrow.classList.toggle('dropdownarrow');
    arrow.classList.toggle('dropuparrow');
    this.removeEventListener("click", expandDropdown);
    this.addEventListener("click", retractDropdown);
}
