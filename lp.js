// You might need to change the port IDs below, check the developer console to see all avalible options
var outPortID = "output-1";
var inPortID = "input-0";

var midi, data, input, output;
var green = 0x3C;
var amber = 0x3F;

// request MIDI access
if (navigator.requestMIDIAccess) {
  navigator.requestMIDIAccess({
    sysex: false
  }).then(onMIDISuccess, onMIDIFailure);
} else {
  alert("No MIDI support in your browser.");
}

// midi functions
function onMIDISuccess(midiAccess) {
  // when we get a succesful response, run this code
  midi = midiAccess; // this is our raw MIDI data, inputs, outputs, and sysex status
  listInputsAndOutputs(midi);
  output = midi.outputs.get(outPortID);
  input = midi.inputs.get(inPortID);
  input.onmidimessage = onMIDIMessage;
}

function onMIDIFailure(error) {
  // when we get a failed response, run this code
  console.log("No access to MIDI devices or your browser doesn't support WebMIDI API. Please use WebMIDIAPIShim " + error);
}

function onMIDIMessage(message) {
  data = message.data; // this gives us our [command/channel, note, velocity] data.
  //console.log('MIDI data', data); // MIDI data [144, 63, 73]
  var noteOnMessage;
  if (data[0] == 144) {
    if (data[2] == 0) {
      noteOnMessage = [0x90, data[1], amber];
    }
    else {
      noteOnMessage = [0x90, data[1], green];
    }
    output.send(noteOnMessage);
  }
}

function listInputsAndOutputs(midiAccess) {
  for (var inEntry of midiAccess.inputs) {
    var input = inEntry[1];
    console.log("Input port [type:'" + input.type + "'] id:'" + input.id +
      "' manufacturer:'" + input.manufacturer + "' name:'" + input.name +
      "' version:'" + input.version + "'");
  }

  for (var outEntry of midiAccess.outputs) {
    var output = outEntry[1];
    console.log("Output port [type:'" + output.type + "'] id:'" + output.id +
      "' manufacturer:'" + output.manufacturer + "' name:'" + output.name +
      "' version:'" + output.version + "'");
  }
}

function reset() {
  var noteOnMessage = [0xB0, 0x00, 0x00];
  output.send(noteOnMessage);
}

function resetAmber() {
  var noteOnMessage = [0xB0, 0x00, 0x7F];
  output.send(noteOnMessage);
}