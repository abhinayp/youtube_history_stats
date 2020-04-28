const tokens = require('./tokens')
const fetch_history = require('./history')

let total_videos = 0
let total_seconds = 0
let seconds_watched = 0
let counter = 0


let current_video_id = null
let last_video_date = null

var show_stats = function() {
  let watched_hours = parseFloat(seconds_watched/3600).toFixed(2)
  let total_hours = parseFloat(total_seconds/3600).toFixed(2)
  console.log(`Total Videos - ${total_videos}`);
  console.log(`Total Seconds - ${total_seconds} sec`);
  console.log(`Total Hours - ${total_hours} hr`);
  console.log(`Watched Time - ${seconds_watched} sec`);
  console.log(`Watched Time(Hours) - ${watched_hours} hr`);
  console.log(`Last Video Date ${last_video_date}`);
}

var get_data = function(ctoken, itct, callback=null) {
  fetch_history(ctoken, itct).then(res => res.json()).then(json => {
    if (callback) {
      callback(json)
    }
  }).catch(err => {
    console.log("\n");
    console.log("ajax error");
    console.log(err);
    console.log(show_stats())
    console.log("\n");
    console.log(last_video_date);
    console.log(current_video_id);
    console.log("\n");
    console.log("----- Tokens -----");
    console.log(ctoken);
    console.log(itct);
  })
}

var get_time = function(text) {
  text = text || ""
  text = text.replace(/,/g, '')
  let time_array = text.split(':').reverse()
  let seconds = 0

  if (time_array.length > 0) {
    seconds = seconds + parseInt(time_array[0])
  }

  if (time_array.length > 1) {
    let minutes_to_sec = parseInt(time_array[1]) * 60
    seconds = seconds + minutes_to_sec
  }

  if (time_array.length > 2) {
    let hours_to_sec = parseInt(time_array[2]) * 3600
    seconds = seconds + hours_to_sec
  }

  return seconds
}

var start_scarping = function(ctoken, itct) {
  try {
    get_data(ctoken, itct, (json) => {
      counter = counter + 1
      let content = json[1].response.continuationContents.sectionListContinuation.contents
      console.log('\n');
      console.log(`Request number - ${counter}`);
      console.log(`Number of videos in the request - ${content.length}`);
      content.map((video, index) => {
        total_videos = total_videos + 1
        current_video_id = video.itemSectionRenderer.contents[0].videoRenderer.videoId
        last_video_date = video.itemSectionRenderer.header.itemSectionHeaderRenderer.title.simpleText
        let total_time_text = video.itemSectionRenderer.contents[0].videoRenderer.lengthText.simpleText
        let percentage_watched = video.itemSectionRenderer.contents[0].videoRenderer.thumbnailOverlays[0].thumbnailOverlayResumePlaybackRenderer.percentDurationWatched
        let video_time = get_time(total_time_text)
        let video_watched_time = video_time * parseInt(percentage_watched)/100
        total_seconds = total_seconds + video_time
        seconds_watched = seconds_watched + video_watched_time
      })


      show_stats()

      let collection = json[1].response.continuationContents.sectionListContinuation
      if (collection.continuations) {
        let next_page_params = collection.continuations[0].nextContinuationData
        let n_ctoken = next_page_params['continuation']
        let n_itct = next_page_params['clickTrackingParams']
        start_scarping(n_ctoken, n_itct)
      }

    })
  } catch (error) {
    console.log("\n");
    console.log("ERROR");
    console.log(`ctoken - ${ctoken}`);
    console.log(`ctoken - ${itct}`);
    console.log("----");
    show_stats()
    console.log(`current video id - ${current_video_id}`);
    console.log(error);
  }
}


let ctoken = tokens.ctoken
let itct = tokens.itct

start_scarping(ctoken, itct)


