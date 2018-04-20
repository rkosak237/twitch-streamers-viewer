(function() {
//arrays
    const   arrOfStreams = [],
            arrOfOffline = [],
            streamer = ["ESL_SC2", "followgrubby", "kinggeorgetv", "redbull", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas"],
            arr = [],
            arrOfLinks = [],
            offlineStreams = [],

            //endpoints and id
            endpointStreams = 'https://api.twitch.tv/kraken/streams/',
            endpointChannels = 'https://api.twitch.tv/kraken/channels/',
            twitchId = '?client_id=953x2pkg7mdtrsnqd9tpnf9w6gm0xf',
            //buttons
            Allstreamers = document.getElementById('btnAllstreamers'),
            Onlinestreamers = document.getElementById('btnOnlinestreamers'),
            Offlinestreamers = document.getElementById('btnOfflinestreamers'),
            button = document.querySelectorAll('.btns'),
            visibleAll = document.querySelectorAll('.online, .offline'),
            visibleOffline = document.querySelectorAll('.offline'),
            visibleOnline = document.querySelectorAll('.online');


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

    function setUrl(endpoint, element, fn) {
        element.map((stream) => {
            let url = endpoint + stream + twitchId;
           arrOfLinks.push(url);
        });
    }
    setUrl(endpointStreams, streamer);
    //--------------------Setting url


    //--------------------Pull data 

Promise.all(arrOfLinks.map(url => 
    fetch(url)
    .then(resp => resp.json())
    .then(data => arr.push(data))))
    .then(() => {

      let onlineStreams = arr.filter((x) => x.stream !== null);
        //console.log(onlineStreams)
            onlineStreams.map(x => {
                return appendOnline(
                    x.stream.channel.logo, 
                    x.stream.channel.name, 
                    x.stream.channel.game, 
                    x.stream.stream_type, 
                    x.stream.channel.url);
            });
    })
    .then(() => {
        let offlineStreams = arr.filter((x) => x.stream == null)
        .map(y => y._links.self.slice(37))
        .map(channelName => endpointChannels + channelName + twitchId);
        
        Promise.all(offlineStreams.map(url => 
            fetch(url)
            .then(resp => resp.json())
            .then(data => arrOfOffline.push(data))))
        .then(() => {
            let offlineStreamer = arrOfOffline.map(x => {
                return appendOffline(
                    x.logo, 
                    x.name, 
                    x._links.self);
            });


        })
    })

    //--------------------append results to elements

    function appendOnline(thumbnail, name, play, status, url) {
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
// console.log(arr);
    //--------------------append results to elements
})();