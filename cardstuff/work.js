{/* <html>
 <body onload="draw();">
   <canvas id="canvas" width="150" height="150"></canvas>
   <div style="display:none;">
     <img id="source" src="https://cdn1.imggmi.com/uploads/2019/9/11/8afd7cf21d6551f71409919734470e16-full.png" width="300" height="227">
     
   </div>
 </body>
</html> */}

function draw() {
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');

  // Draw slice
  ctx.drawImage(document.getElementById('source'),
                0, 0, 55, 100, 50, 20, 87, 104);

  // Draw frame
  ctx.drawImage(document.getElementById('frame'), 0, 0);
}