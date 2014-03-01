(function() {

    // add local file
    (function () {
        $("#local_file_open").change(function() {        
            if (typeof this.files != "undefined") {
                if (this.files.length >= 1) {
                    try {
                        //Gecko 1.9.2+ (Standard Method)
                        var binaryHandle = new FileReader();
                        binaryHandle.onload = function () {
                            if (this.readyState == 2) {
                                start_wrapper(mainCanvas, this.result);
                            }
                        }
                        binaryHandle.readAsBinaryString(this.files[this.files.length - 1]);
                    } catch (error) {
                        //Gecko 1.9.0, 1.9.1 (Non-Standard Method)
                        var romImageString = this.files[this.files.length - 1].getAsBinary();
                        start_wrapper(mainCanvas, romImageString);
                    }
                }
            }
        });
    })();

    // add dropbox
    (function () {
        // canvas for gbc
        var mainCanvas = document.getElementById("mainCanvas");

        var options = {
          success: function(files) {
            var file_req = new XMLHttpRequest();
            // files is an array
            var file = files[0];
            //request file data
            file_req.open("GET", file.link, true);
            file_req.responseType = "arraybuffer";
            file_req.onload = function(e) {
              var resp_dataview = new Uint8Array(file_req.response);
              if (typeof resp_dataview == "undefined") {
                alert("File upload failed (undefined): check file type?");
              }
              var chunksize = 65536;
              var chunks = Math.floor(file.bytes/chunksize);
              var bindata = "";
              for (var i = 0; i < chunks; i++) {
                bindata += String.fromCharCode.apply(null, resp_dataview.subarray(i*chunksize, (i+1)*chunksize));
              }
              bindata += String.fromCharCode.apply(null, resp_dataview.subarray(chunks*chunksize));
              
              // jumps to gbc
              start_wrapper(mainCanvas, bindata);
            }
            file_req.send();
          },
          multiselect: false,
          linkType: "direct",
        }

        var button = Dropbox.createChooseButton(options);
        document.getElementById("dropbox-container").appendChild(button);
    })();

    function start_wrapper(mainCanvas, bindata) {
        $("#gif").fadeOut("fast", function() {
            $("#mainCanvas").fadeIn("fast", function() {
                start(mainCanvas, bindata);
                $("#choose-rom").fadeOut("fast", function(){
                  $("#rom-done").fadeIn("fast", function(){
                    $("#mobile-controls").fadeIn("fast");
                    $("#settings").fadeIn("fast");
                    main();
                  });
                });
            });
        });
    }

}());