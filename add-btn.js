document.getElementsByClassName("right-of-crumbs")[0].insertAdjacentHTML("beforeend", '<a class="btn" href="#" id="undeleteLink">Undelete</a>');

document.getElementById("easy_student_view").style.marginLeft = "4px";

document.getElementById("undeleteLink").onclick=function(){
    document.getElementById("undeleteLink").href = window.location.href + "/undelete";
}