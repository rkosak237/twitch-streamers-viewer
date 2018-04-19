(function() {

    const arrOfStreams = [];
    const arrOfOffline = [];
    const streamer = ["ESL_SC2", "followgrubby", "kinggeorgetv", "redbull", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas"];

    //buttons
    const Allstreamers = document.getElementById('btnAllstreamers');
    const Onlinestreamers = document.getElementById('btnOnlinestreamers');
    const Offlinestreamers = document.getElementById('btnOfflinestreamers');
    const button = document.querySelectorAll('.btns');
    const visibleAll = document.querySelectorAll('.online, .offline');
    const visibleOffline = document.querySelectorAll('.offline');
    const visibleOnline = document.querySelectorAll('.online');

    Allstreamers.addEventListener('click', filterAll);
    Onlinestreamers.addEventListener('click', filterOnline);
    Offlinestreamers.addEventListener('click', filterOffline);

    //--------------------filter categories

    function filterAll(e) {
        e.preventDefault();

        [].map.call(document.querySelectorAll('.online, .offline'), function(el) {
            el.classList.add('active');
        });
    }

    function filterOffline(e) {
        e.preventDefault();
        [].map.call(document.querySelectorAll('.offline, .online'), function(el) {
            el.classList.remove('active');
        });
        [].map.call(document.querySelectorAll('.offline'), function(el) {
            el.classList.add('active');
        });
    }


    function filterOnline(e) {
        e.preventDefault();
        [].map.call(document.querySelectorAll('.offline, .online'), function(el) {
            el.classList.remove('active');
        });
        [].map.call(document.querySelectorAll('.online'), function(el) {
            el.classList.add('active');
        });
    }
    //--------------------filter categories


    //--------------------Setting url

    function setUrl(e) {
        e.map((stream) => {
            let url = 'https://api.twitch.tv/kraken/streams/' + stream + '?client_id=953x2pkg7mdtrsnqd9tpnf9w6gm0xf';
            getData(url);
        });
    }
    setUrl(streamer);
    //--------------------Setting url


    //--------------------Pull data 

    function getData(url) {
        return new Promise((resolve) => {
            let rawData = '';
            let data = '';
            let request = new XMLHttpRequest();

            request.open('GET', url, true);
            request.onload = function() {
                if (this.status >= 200 & this.status < 400) {
                    rawData = this.response;
                    data = JSON.parse(this.response);
                    resolve(data);
                    if (data.stream !== null) {

                        const fetchedDataOnline = {
                            whatsPlayin: data.stream.game,
                            preview: data.stream.channel.logo,
                            channelName: data.stream.channel.name,
                            streaming: data.stream.channel.game,
                            link: data.stream.channel.url,
                            live: data.stream.stream_type
                        }
                        appendOnline(fetchedDataOnline.preview, fetchedDataOnline.channelName, fetchedDataOnline.whatsPlayin, fetchedDataOnline.streaming, fetchedDataOnline.live, fetchedDataOnline.link);

                    } else {
                        function getUser() {
                            const toSlice = data._links.self;
                            const afterSlice = toSlice.slice(37);
                            arrOfOffline.push(afterSlice);

                            for (let i = 0; i < arrOfOffline.length; i++) {
                                let url = 'https://api.twitch.tv/kraken/channels/' + arrOfOffline[i] + '?client_id=953x2pkg7mdtrsnqd9tpnf9w6gm0xf';
                                var request = new XMLHttpRequest();
                                //tutaj się psuje przy zmianie na const/let
                                request.open('GET', url, true);

                            }

                            // arrOfOffline.map(x => {
                            //   let url = 'https://api.twitch.tv/kraken/channels/' + x + '?client_id=953x2pkg7mdtrsnqd9tpnf9w6gm0xf';
                            //   var request = new XMLHttpRequest();
                            //       //tutaj się psuje przy zmianie na const/let
                            //       request.open('GET', url, true);
                            // });
                            //load data
                            request.onload = function() {
                                if (this.status >= 200 & this.status < 400) {
                                    // Success!
                                    const result = JSON.parse(request.response);

                                    const fetchedDataOffline = {
                                        name: result.display_name,
                                        logotype: result.logo,
                                        currently: result.status,
                                        link: result._links.self
                                    }

                                    appendOffline(fetchedDataOffline.logotype, fetchedDataOffline.name, fetchedDataOffline.link);

                                } else {
                                    console.log("We reached our target server, but it returned an error");
                                }
                            };
                            request.onerror = function() {
                                // There was a connection error of some sort
                            };
                            request.send();

                        }
                        getUser();
                        //Call to Channels
                    }

                } else {
                    console.log("We reached our target server, but it returned an error");
                }
            }
            request.send();
        })
    }

    //--------------------Pull data 




    //--------------------append results to elements

    function appendOnline(thumbnail, name, play, subject, status, url) {
        document.getElementById("result").innerHTML +=
            `
        <li class="large-12 medium-12 small-12 columns list-style online active">
            <figure class="large-2 medium-3 small-3 columns"> 
              <img class="channel" src="${thumbnail}" alt=""> 
            </figure>
            <div class="large-3 medium-3 small-3columns">
              <span class="column">${name}</span>
            </div>
            <div class="large-5 medium-4 small-4 columns">
              <span class="column">${play}</span>
            </div>
            <div class="large-2 medium-2 small-2 columns">
             <span> <a class="results-container__statusOnline" href="${url}" target="_blank">${status}</a></span>
            </div>
        </li>
`;
    }


    function appendOffline(thumbnail, name, url) {
        document.getElementById("result").innerHTML +=
            `
         <li class="large-12 medium-12 small-12 columns list-style offline active">
            <figure class="large-2 medium-3 small-3 columns"> 
              <img class="channel" src="${thumbnail}" alt=""> 
            </figure>
            <div class="large-3 medium-4 small-4 columns">
              <span class="column">${name}</span>
            </div>
            <div class="large-7 medium-5 small-5 text-center columns">
             <span> 
                <a class="results-container__statusOffline" href="#" >Offline</a>
             </span>
            </div>

        </li>
`
    }


    //--------------------append results to elements
})();