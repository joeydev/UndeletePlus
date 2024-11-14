//grab the initial list of deleted items showing on screen
let list = document.getElementById("deleted_items_list").getElementsByTagName('li');
let filteredList = list; //this is a variable that holds the list of items if the user sets a filter. start by setting it to match the initial list

//Restore by ID
document.getElementById("content").insertAdjacentHTML("afterbegin", '<h2>Restore by ID</h2><div style="padding: 0px 0px 5px 0px"><select id="UbyID-SCT" name="Select_Content_Type" style="margin:0px 4px 0px 0px;"><option value="none" selected disabled hidden>Select Content Type</option><option value="assignment">Assignment</option><option value="quiz">Classic Quiz</option><option value="assignment">New Quiz</option><option value="discussion_topic">Discussion</option><option value="discussion_topic">Announcement</option><option value="context_module">Module</option><option value="assignment_group">Assignment Group</option><option value="wiki_page">Page</option><option value="group">Group</option><option value="group_category">Group Set</option><option value="rubric">Rubric</option><option value="rubric_association">Rubric Association</option><option value="attachment">File</option></select><input id="UbyID-EID" style="margin:0px 4px 0px 0px;" name="Enter_ID" placeholder="Enter ID" type="text"><a class="btn" href="#" id="UbyID-BTN" style="margin:0px 0px 0px 0px;">Restore by ID</a></div>'); //insert the drop-down to select content type, text field to enter id, and button to submit. note: href="#" is a necessary (empty) placeholder

document.getElementById("UbyID-BTN").onclick=function(){ //when the button is clicked, run this function
    event.preventDefault(); //prevent the button's class from executing it's code
    let contentType = document.getElementById("UbyID-SCT").value; //get the content type from the drop-down
    let contentID = document.getElementById("UbyID-EID").value; //get the id number from the text field
    document.getElementById("UbyID-BTN").href = window.location.href + "/" + contentType + "_" + contentID; //set the href of the button link to the appropriate path using the two vars above
    document.getElementById("UbyID-EID").value = ""; //clear the id's text field for the next call
    const $link = $("#UbyID-BTN") //set var for use in canvas' ajaxJSON script. see included files (listed in the manifest) for this script and other necessary scripts
    $.ajaxJSON(
        $link.attr('href'),
        'POST',
        {},
        () => { //if restore is succesful...
                for (i = 0; i < list.length; i++) { //add this function to check if the restored item is on the list of deleted items. if it is, remove it
                  if(list[i].children[0].children[0].href == document.getElementById("UbyID-BTN").href){
                    list[i].remove();
                    break;
                  }
                }
                alert("Restore by ID: Success!");
              },
        () => alert("Restore by ID: Restore failed") //if restore fails
    )
}

//Sort, search, & filter
document.getElementById("deleted_items_list").insertAdjacentHTML("beforebegin", '<div id="U+Options" style="margin-top:6px"><input type="text" id="filText" placeholder="Search for items"></input><select id="sort-deleted-items" style="margin-left:4px"><option value="none" selected disabled hidden>Arrange by</option><option value="name_a-z">Name: A-Z</option><option value="name_z-a">Name: Z-A</option><option value="date_n-o">Date: Newest to Oldest</option><option value="date_o-n">Date: Oldest to Newest</option></select><select id="filContent" style="margin-left:4px"><option value="none" selected disabled hidden>Filter by Content Type</option><option value="all">All</option><option value="Assignment">Assignment</option><option value="Quizzes::Quiz">Classic Quiz</option><option value="Assignment">New Quiz (Assignment)</option><option value="DiscussionTopic">Discussion</option><option value="Announcement">Announcement</option><option value="ContextModule">Module</option><option value="AssignmentGroup">Assignment Group</option><option value="WikiPage">Page</option><option value="Group">Group</option><option value="GroupCategory">Group Set</option><option value="Rubric">Rubric</option><option value="RubricAssociation">Rubric Association</option><option value="Attachment">File</option></select><button class="btn" id="MassRestoreBtn" style="margin:0px 0px 0px 4px;float:right">Configure Mass Restore</button></div>'); //add the search text field, the arrange drop-down, filter drop-down, and mass restore button

//Arrange by
//Alphabetically
document.getElementById("sort-deleted-items").onchange=function(){ //when the value of the drop-down chnages, run this function
  let value = document.getElementById("sort-deleted-items").value; //get the value of the arrange drop-down
  if(value === "name_a-z" || value === "name_z-a"){ //if you choose one of the two alphabetical options
    let switching = true; //set this to true to start the loop that searches for items that need to switch places
  
    while (switching){ //this loop searches the list for items that need to be switched. progressively switches items until the list is in the order you chose
      let i; //declare this up here so we can use it in both code blocks below
      switching = false; //set this to false so that the loop ends if an item switch doesn't set it back to true
      for (i = 0; i < (list.length - 1); i++){ //loop through the items checking the spelling to detect item switches
        if(value == "name_a-z"){ //if you chose a to z
          if (list[i].children[1].innerHTML.toLowerCase() > list[i + 1].children[1].innerHTML.toLowerCase()){ //check the spelling of two adjacent items to see if they should switch places
            switching = true; //set this to true when you find a switch to do the switch and restart the loop
            break; //stop this loop so we can make the item switch
          } 
        } else { //if you chose z to a
            if (list[i].children[1].innerHTML.toLowerCase() < list[i + 1].children[1].innerHTML.toLowerCase()){ //change the > sign to < to sort in reverse alphabetical order
              switching = true;
              break; 
            }
          }
        }
        if (switching){ //if  an item switch was found
          list[i].parentNode.insertBefore(list[i + 1], list[i]); //make the item switch
        }
      }
    }
  else {
//if you chose to arrange by date
    let switching = true;
    let currentYear = new Date().getFullYear(); //get the current year to use in date sorting
  
    for (let i = 0; i <= (list.length - 1); i++){ //this loop gets the age of each deleted item as milliseconds passed since Jan 1 1970 00:00:00 GMT up until the moment the item was deleted, then sets the age to a variable assigned to each item
      //format date and time to convert to JS date object. our final format looks like: Jan 1 1970 00:00:00 AM

      //there might be a simpler way to do this but i'm not getting paid to write this stuff
      let itemDate = list[i].children[4].rows[1].cells[1].innerHTML.replace(",", "");//get the item's 'last updated' date on screen and assign it to itemDate. if the item is from a previous year it'll show as 'Month Day, Year' so remove the comma with replace()
      
      let itemTime = itemDate.split(" ").slice(-1);//separate the date and time by assigning the time to itemTime. use space as delimiters with split(). a negative value in slice() starts counting backwards from the end, so here it slices at the first space starting from the end going backwards
      itemTime = itemTime.join("");//split() turns a string into an array of substrings, so turn it back into a string
      itemTime = itemTime.replace("am", ":00 AM");//start formatting the time to something JS can read
      itemTime = itemTime.replace("pm", ":00 PM");
      itemTime = " " + itemTime;//add a space to the beginning of the time string to use it to check for single-digit hours
      if(itemTime.includes(" \d:")){itemTime = replace(" ", "");itemtime = "0" + itemTime;}//date() format requires a two digit hour. so use regex to check if the time string has a space, only a single digit, then a colon. then add a 0 to the front of the single-digit hour. \d in regex matches any digit
      
      itemDate = itemDate.split(" ").slice(0, 3);//cut up the date text every time there's a space, get rid of everything after and including the third space
      itemDate = itemDate.join(" ");//split turned the string into an array of substrings with commas as delimiters, so join it back together into one string and turn the commas into spaces
      itemDate = itemDate.replace(" at", " " + currentYear);//the items from this year have an 'at' left from the slice since they don't have the year displayed by default. replace the 'at' with the current year
      itemDate = itemDate + " " + itemTime;//join the date string with the time string
      itemDate = new Date(itemDate);//turn the formatted date and time into a date-type object so JS can use it for date functions
      list[i].dateMs = itemDate.getTime();//getTime() gets the age of the object in milliseonds. assign it to a variable as a property of the list item
    }

    while (switching){
      let i;
      switching = false;

      if(value == "date_n-o"){ //if you chose newest to oldest
        for (i = 0; i < (list.length - 1); i++) {
          if (list[i].dateMs < list[i + 1].dateMs) {//if current object is older than the next object, have it move down the list
            switching = true;
            break;
          }
        }
      } else { //if you chose oldest to newest
        for (i = 0; i < (list.length - 1); i++) {
          if (list[i].dateMs > list[i + 1].dateMs) { //change < to > to arrange in reverse chronological order
            switching = true;
            break;
          }
        }
      }
      if (switching) {
        list[i].parentNode.insertBefore(list[i + 1], list[i]);
        switching = true;
      }
    }
  }
}

//Search items
document.getElementById("filText").onkeyup=function(){ //when a key is pressed inside the search text field
  //note: vars defined as html elements and htmlcollections (not static nodes / nodelists via querySelector) will update if the element is changed (if vice-versa isn't working, check the data type of the var to make sure you haven't reassigned it). this was relevent to my other idea on how to accomplish this type of search highlighting, which was to generate a static copy of the deleted-items-list via querySelector and reference it to replace the <mark>'ed titles with the tagless text. didn't end up having to try that so idk if it would've worked as well as this
  updateSearch(); //call the function that updates the search results & text highlighting
}

//Filter by content type
document.getElementById("filContent").onchange=function(){//when the drop-down changes, perform this function
  let currentFilter = document.getElementById('filContent').value;//check which content type is selected in the drop-down
  filteredList = [];//reset the filteredList array so we can build a new filtered list
  for (let i = 0; i < list.length; i++) { //loop through all list items
      //filter(i); //have the filter function check if the item in the list at position 'i' gets filtered
    let contentType = list[i].children[2].innerHTML.trim();//the content type text on screen has whitespace for some reason, so trim it
    if(currentFilter != "all"){
      if(contentType === currentFilter){
        //alert("show");
        list[i].style.display = "";
        filteredList.push(list[i]);
      } else {
        list[i].style.display = "none";
      }
    } else {
      list[i].style.display = "";
      filteredList.push(list[i]);
    }
  }
  updateSearch();//update the search results and highlighting on the new version of filteredList. I had intended to only have this run of the search wasn't blank, but if the user switches the content type filter, the highlighting doesn't get cleared on the previous results since they get removed from filteredList before this is run. Old highlighting will be seen if you do that then switch the filter back to a type that shows the old results without typing in the search bar. there are a few workarounds but since updateSearch only runs on filteredList and does less when the search is empty I'll keep it this way
}

function updateSearch(){
  let search = document.getElementById('filText').value; //get the value of the search text field
  for (let i = 0; i < filteredList.length; i++){ //loop through the item list
   let text = filteredList[i].children[1].innerHTML.replace(/<\/?mark>/g, ""); //use .replace() to clear any existing highlighting. use regex to match both <mark> and </mark> with the "/ being an optional character denoted by the ? in the expression. g makes a global expression to match all instances found
   if (search !== "") { //we technically don't need this but if left out there's visual artifacts on the text when clearing the search field. it's very subtle for our text here but i'm going to call this a best practice

    if (text.toUpperCase().indexOf(search.toUpperCase()) > -1) {//indexOf doesn't accept regexps so for this simple check we'll use toUpperCase to check if the item contains the search with any case (uppercase/lowercase)

        let re = new RegExp(search,"gi"); //have to use RegExp method to create a regex from a string. gi denotes a global expression (g - finds all instances of a match, not just the first) that ignores case (i)

        text = text.replace(re, "<mark>$&</mark>"); //$& is a backreference - commands used to reference previous parts of a match - this one just returns the regex object's lastMatch property. use it here to replace each match with itself so we don't mess up the case of the match. add <mark>s to highlight the search

        filteredList[i].style.display = "";//if the item matches, make sure it's showing
      } else{
        filteredList[i].style.display = "none"; //if the item doesn't contain the search, hide it
        }
    } else{
      filteredList[i].style.display = "";//if search field has become blank, display all items without highlighting
      }
      filteredList[i].children[1].innerHTML = text;//update the text of the item
  }
}
/*
//Mass Restore
document.getElementById("U+Options").insertAdjacentHTML("afterend", '<div id="MR-Container" style="background-color:lightgrey;display:none"><p>Select Mass Restore Options</p><label class="checkbox"><input type="checkbox" value="1" id="restore_all">Restore All Items</label></br><label class="checkbox"><input type="checkbox" value="1" id="massRestoreByDate">Restore by Date</label><div id="MR-dateContainer" style="background-color:yellow;display:none"></div></br><label class="checkbox"><input type="checkbox" value="1" id="massRestoreByType">Restore by Content Type</label><div id="MR-typeContainer" style="background-color:orange;display:none"></div><div id="MR-List"></div><button class="btn" id="MassRestoreSubmit">Begin Restore</button></div>')
//need restore before and after? on specific day?

document.getElementById("MassRestoreBtn").onclick=function(){
  if(document.getElementById("MR-Container").style.display != ""){
    document.getElementById("MR-Container").style.display = "";
  } else {
    document.getElementById("MR-Container").style.display = "none";
  }
}

document.getElementById("MassRestoreSubmit").onclick=function(){
  if(document.getElementById("restore_all").checked){
    for (let i = 0; i < list.length; i++){
      document.getElementById("MR-List").innerHTML = document.getElementById("MR-List").innerHTML + "<div class='MR-item'>" + list[i].children[1].innerHTML + "</div>";
    }
    mrItemList =  document.getElementById("MR-List").getElementsByClassName('MR-item');
    initialLength = mrItemList.length;
    listNum = 0;
    massRestoreItems(listNum);
  } else {
      if(document.getElementById("massRestoreByDate").checked){
        
    } else {
        if (document.getElementById("massRestoreByType").checked){

    }

  }
}

function massRestoreItems(i){
  mrItemList =  document.getElementById("MR-List").getElementsByClassName('MR-item');
  if(listNum < mrItemList.length){ //If
    $.ajaxJSON(
      list[i].children[0].children[0].href,
      'POST',
      {},
      () => { //if restore is successful...
              list[i].remove();
              console.log("success= " + i)
              mrItemList[listNum].style.color = "green";
              listNum+=1;
              restoreItem(i) //
            },
      () => {
              //if restore fails....
              mrItemList[listNum].style.color = "red";
              listNum+=1;
              restoreItem(i + 1)
            }
    )
  }
}
*/