import { Conversation } from '@11labs/client'
const button = document.getElementById('status')
const ring = document.getElementById('ring')
const audio = document.getElementById("myAudio");

/** @type Conversation | undefined **/
let conversation = undefined
/** @type string **/
let signedUrl = ''
async function init() {
  await navigator.mediaDevices.getUserMedia({ audio: true });
  const response = await fetch("/signed-url");
  signedUrl = await response.text();
}
init();
let protocol = ''
document.body.onclick = async () => {
  if (playing || conversation) {
    if (conversation) {
      await conversation.endSession()
      conversation = undefined
      document.body.classList = ''
    } else {
      await startSession()
    }
  }
  else {
    make_ring()
    document.body.classList = 'telephone'
  }
}

async function startSession() {
  try {
    if (conversation === undefined) {
      conversation = await Conversation.startSession({
        signedUrl,
        onConnect: () => {
          audio.pause();
          playing = false;
        },
        onError: (obj) => {
          console.error(obj)
          conversation = undefined
          button.innerText = 'Start'
        },
        onDisconnect: () => {
          console.warn('disconnected')
          conversation = undefined
          button.innerText = 'Start'
          fetch("/summary", {
            method: "POST",
            type: 'application/text',
            body: protocol
          });
        },
        onStatusChange: ({ status }) => {
          console.log(status)
        },
        onMessage: ({ message, _role }) => {
          protocol += `${message}\n`;
          console.log(message)
        }
      });
      button.innerText = 'Stop'
    }
    else {
      log()
      await conversation.endSession()
      conversation = undefined
      button.innerText = 'Start'

    }
  }
  catch (_) { }
}
function make_ring() {
  if (playing) {
    audio.pause();
    playing = false;
  } else {
    audio.play();
    playing = true;
  }
}
let playing = false
ring.onclick = function log() {
  console.log(conversation.getInputByteFrequencyData())
  console.log(conversation.getOutputByteFrequencyData())
}

