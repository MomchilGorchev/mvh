!(function(){

    var model = {
        init: function(){
            if(!localStorage.notes){
                localStorage.notes = JSON.stringify([]);
            }
        },

        add: function(obj){
            var data = JSON.parse(localStorage.notes);
            data.push(obj);
            localStorage.notes = JSON.stringify(data);
        },

        getAllNotes: function(){
            return JSON.parse(localStorage.notes);
        }
    };

    var hub = {
        addNewNote: function(note){
            model.add({
                content: note,
                created: Date.now()
            });
            view.render();
        },

        getNotes: function(){
            return model.getAllNotes().reverse();
        },

        init: function(){
            model.init();
            view.init();
        }
    };

    var view = {
        init: function(){
            this.notesList = $('#notes');
            var newNoteForm = $('#new-note-form'),
                newNoteContent = $('#new-note-content');

            newNoteForm.on('submit', function(e){
                e.preventDefault();
                console.log('fired');
                hub.addNewNote(newNoteContent.val());
                newNoteContent.val('');
            });
            view.render();
        },

        render: function(){
            var htmlStr = '';
            hub.getNotes().forEach(function(item){
                htmlStr +=
                    '<li class="note-item">' +
                        item.content +
                        '<span>'+ new Date(item.created) +'</span>'+
                    '</li>';
            });
            this.notesList.html(htmlStr);
        }
    };

    hub.init();
})();