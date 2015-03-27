/**
 * MV* Type of flow where the model never gets to communicate to the view directly.
 * The middleware (controller) is called hub in this example
 */
!(function(){

    /**
     * The MODEL of the application - responsible for storing the data.
     * @type {{
     *  init: Function,
     *  add: Function,
     *  remove: Function,
     *  getAllNotes: Function
     *  }}
     */
    var model = {
        // Create DB if not existing
        init: function(){
            if(!localStorage.notes){
                localStorage.notes = JSON.stringify([]);
            }
        },

        // Add new Note to the list
        add: function(obj){
            var data = JSON.parse(localStorage.notes);
            data.push(obj);
            localStorage.notes = JSON.stringify(data);
        },

        // Remove Note from the list
        remove: function(noteId){
            var data = JSON.parse(localStorage.notes);
            // Iterate over the list to find the note to be deleted.
            // This metohd will be different for different data schemas
            data.forEach(function(note){
                if(note.id === +noteId){
                    // If removing the last index
                    if(data.indexOf(note) === data.length - 1){
                        data.pop();
                    } else {
                        // Not efficient on large arrays
                        data.splice(data.indexOf(note), 1);
                    }
                }
            });
            // Save back the remaining notes
            localStorage.notes = JSON.stringify(data);
        },

        // Send all notes
        getAllNotes: function(){
            return JSON.parse(localStorage.notes);
        }
    };

    /**
     * The HUB/CONTROLLER of the application
     * Taking care of the communication between the MODEL and the VIEW
     * @type {{
     *  addNewNote: Function,
     *  deleteNote: Function,
     *  getNotes: Function,
     *  init: Function
     * }}
     */
    var hub = {
        // Passes a new note from the view to the model
        addNewNote: function(note){
            var now = Date.now();
            model.add({
                content: note,
                created: now,
                id: now * 3
            });
            view.render();
        },

        // Pass a note ID to be deleted form the DB
        deleteNote: function(noteId){
            if(noteId){
                model.remove(noteId);
                view.render();
            }
        },

        // Query the model for all data
        getNotes: function(){
            return model.getAllNotes().reverse();
        },

        // Initiate the model and the view
        init: function(){
            model.init();
            view.init();
        }
    };

    /**
     * The VIEW/VIEWS of the application.
     * Manages all DOM manipulation and event binding code
     * @type {{
     *  init: Function,
     *  render: Function
     * }}
     */
    var view = {
        // Cache DOM elements and bind events
        init: function(){
            this.notesList = $('#notes');
            var newNoteForm = $('#new-note-form'),
                newNoteContent = $('#new-note-content');

            newNoteForm.on('submit', function(e){
                e.preventDefault();
                hub.addNewNote(newNoteContent.val());
                newNoteContent.val('');
            });

            this.notesList.on('click', '.delete-note', function(e){
                e.preventDefault();
                var _this = $(e.currentTarget),
                    parent = _this.closest('li'),
                    id = parent.attr('data-itemid');

                hub.deleteNote(id);
            });
            view.render();
        },

        // Renders the notes list on the screen
        render: function(){
            var htmlStr = '';
            hub.getNotes().forEach(function(item){
                htmlStr +=
                    '<li class="note-item" data-itemid="'+ item.id +'">' +
                        '<a href="#" class="delete-note">X</a>' +
                            item.content +
                        '<span>'+ new Date(item.created) +'</span>'+
                    '</li>';
            });
            this.notesList.html(htmlStr);
        }
    };
    hub.init();
})();