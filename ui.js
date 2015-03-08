$(document).ready(function() {
    $("#createKeyFrame").click(function(){
        var popindex = 0;
        for (var i = 0; i < pop.population.length; i++){
            if (pop.population[i] == axis.selected){
                popindex = i;
                break;
            }
        }
        $(".frame_list[data-frame='" + popindex + "']").find(".frame").each(function(){
            if($(this).hasClass("selected")){
                $(this).addClass("keyframe");
            }
        });
        //selected frame is now new keyframe
        axis.frame = $(".selected").attr("id");
        //create that frame (redraw, set frame to selected frame)
        axis.createNewKeyframe(axis.selected);
        axis.clear(axis.selected);
        axis.create(axis.selected, axis.frame);

        axis.select(axis.selected, pop.population);
    });

    $createFrame = $("#createFrame");
    var frameClick = function(){
        //select every frame on the current frame
        var currentFrame = $(this).attr("id");
        $('.frame_list').each(function(){
            $(".frame").each(function(){
                $(this).removeClass("selected");
                if ($(this).attr("id") == currentFrame){
                    $(this).addClass("selected");
                }
            });
        });
        axis.frame = $(this).attr("id");
        //redrawing the canvas based on the frame
        axis.frame = $(".selected").attr("id");
        pop.population.forEach(function(element) {
            //console.log(axis.getLocation(element.frames, axis.frame));
            axis.clear(element);
            axis.create(element, axis.frame);
        });
        axis.select(axis.selected, pop.population);
    };
    $(".frame").click(frameClick);

    var frameNum = 1;

    //button click -> create frame and add click listener
    $createFrame.click(function(){
        $('.frame_list').each(function(){
            $(this).find('tr').append('<td><div class="frame"></div></td>');
            $(this).find('tr td:last .frame').click(frameClick);
            //add an id that increments for each div
            $(this).find('tr td:last .frame').attr("id", frameNum);
            //axis.lastFrame = frameNum;
        });
        // $('#frame_list tr').append('<td><div class="frame"></div></td>');
        // $('#frame_list tr td:last .frame').click(frameClick);
        // //add an id that increments for each div
        // $('#frame_list tr td:last .frame').attr("id", frameNum);
        // //axis.lastFrame = frameNum;
        frameNum++;
    });

    for(var i = 0; i < 10; i++){
        $createFrame.click();
    }

    var selectClick = function(){
        axis.select(pop.population[$(this).attr("id").charAt(6)-1], pop.population);
    };

    //creating a new stickman 
    $("#createPerson").click(function(){
         var newStickman = pop.addStickman();
         pop.toPaper(newStickman);
         console.log(newStickman);
         pop.population.push(newStickman);
         axis.create(newStickman, axis.frame);
         axis.select(pop.population[pop.population.length - 1], pop.population);
         $("#element_list ul").append("<li>Dude "+pop.population.length+"</li>");
         $("#element_list ul li:last").attr("id","person"+pop.population.length);
         $("#element_list ul li:last").click(selectClick);

         //adding a new table containing the frames 
         $("#table_list").append("<table class='frame_list'><tr></tr></table>");
         $("#table_list table:last").attr("data-frame", pop.population.length - 1);
         $("#table_list table:last tr").append("<td> <div class='frame keyframe' id ='0'></div></td>");
         $("#table_list table:last tr td .frame").click(frameClick);
         //selects the frame if it is currently selected
         if (axis.frame == 0){
            $("#table_list table:last tr td .frame").click();
         }
         //adds a frame for every frame already existing
         // console.log($("#table_list table:last tr"));
         var length = $('.frame_list:first-child tr td').length;
         for (var i = 1; i < length; i++){
            $("#table_list table:last tr").append("<td><div class='frame' id = '" + i + "'></div></td>");
            $("#table_list table:last tr td:last .frame").click(frameClick);
            if (axis.frame == i){
                $("#table_list table:last tr td .frame").click();
             }
         }

     });

     $("li").click(selectClick);

     $("#deletePerson").click(function(){
        var index;
        for (var i = 0; i < pop.population.length; i++) {
            if (pop.population[i] == axis.selected) {
                index = i;
                break;
            }
        }
        $("li").eq(index).remove();
        pop.population.splice(index,1);
        axis.clear(axis.selected);
        axis.deleteJoints(axis.selected);
        paper.view.update();
     });

    $("#animate").click(function(){
        axis.animate(frameNum-1);
    });

    $("#deleteKeyFrame").click(function(){
        if (pop.population.length > 1) {
            if(axis.frame != 0) {
                $(".frame").each(function(){
                    if($(this).hasClass("selected")){
                        $(this).removeClass("keyframe");
                    }
                });
                axis.deleteKeyframe(axis.selected,axis.frame);
                axis.clear(axis.selected);
                axis.create(axis.selected, axis.frame);
                axis.select(axis.selected, pop.population);
                paper.view.update();
            }
        }
    });

    $("#save").click(function(){
        pop.save();
    });

    $("#open").click(function(){
        pop.open();
    });

    $(window).keydown(function(event){
        var NEXT_FRAME = 190;
        var PREV_FRAME = 188;
        var ANIMATE = 13;
        var NEW_FRAME = 78;
        var NEW_KEYFRAME = 32;
        if (event.keyCode == NEW_FRAME) {
            $("#createFrame").click();
        } else if (event.keyCode == NEW_KEYFRAME) {
            $("#createKeyFrame").click();
        } else if (event.keyCode == ANIMATE) {
            $("#animate").click();
        } else if (event.keyCode == NEXT_FRAME && parseInt(axis.frame)+1<=parseInt(axis.lastFrame)) {
            $("#" + (parseInt(axis.frame)+1)).click();
        } else if (event.keyCode == PREV_FRAME && parseInt(axis.frame)>0) {
            $("#" + (axis.frame-1)).click();
        }
        return false;
    });
});
