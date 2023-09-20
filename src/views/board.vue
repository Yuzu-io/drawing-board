<template>
  <div class="board">
    <h1 class="title">
      多人协同画板(未完成)
      <br>
      <br>
      提示：暂未适配手机端
    </h1>
    <canvas class="canvas" ref="canvas"></canvas>
    <div class="tools">
      <div class="color" :class="{ 'active': msg.currentToolsIndex == 0 }" @click="clickTools(0)"></div>
      <div class="clear-rect" :class="{ 'active': msg.currentToolsIndex == 1 }" @click="clickTools(1)">
        橡皮
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { Socket } from '@/plugins/utils/socket';

const msg = reactive({
  currentToolsIndex: 0,
  isDown: false,
  isEnd: true,
  x: 0,
  y: 0
})
let canvas = ref<HTMLCanvasElement | null>(null)
let ctx = ref<CanvasRenderingContext2D | null>(null)
const ws = new Socket('ws://www.yuzuchan.top:83')

onMounted(() => {
  ctx.value = (canvas.value as HTMLCanvasElement).getContext('2d') as CanvasRenderingContext2D

  ws.connect()
  let wsExample = ws.getWebSocket() as WebSocket;
  wsExample.onmessage = (event) => {
    const data = JSON.parse(event.data)
    console.log(data);
    
    if (!data.isEnd) {
      const brush = (ctx.value as CanvasRenderingContext2D)
      if (!data.isDown) {
        if (data.currentToolsIndex === 0) {
          brush.beginPath()
          brush.moveTo(data.x, data.y)
        }
        if (data.currentToolsIndex === 1) {
          brush.clearRect(data.x, data.y, 10, 10)
          brush.clearRect(data.x, data.y, 10, -10)
          brush.clearRect(data.x, data.y, -10, -10)
          brush.clearRect(data.x, data.y, -10, 10)
        }
      } else {
        if (data.currentToolsIndex === 0) {
          brush.lineTo(data.x, data.y)
          // 填充颜色
          brush.strokeStyle = 'black'
          brush.stroke()
        }
        if (data.currentToolsIndex === 1) {
          brush.clearRect(data.x, data.y, 10, 10)
          brush.clearRect(data.x, data.y, 10, -10)
          brush.clearRect(data.x, data.y, -10, -10)
          brush.clearRect(data.x, data.y, -10, 10)
        }
      }
    }
  }

  if (!IsPC()) {
    canvas.value!.setAttribute('width', '800')
    canvas.value!.setAttribute('height', '500')
    canvas.value!.onmousedown = drawingDown
    canvas.value!.onmousemove = drawingMove
    canvas.value!.onmouseup = drawingUp
  } else {
    canvas.value!.setAttribute('width', '300')
    canvas.value!.setAttribute('height', '400')
    canvas.value!.ontouchstart = drawingTouchstart
    canvas.value!.ontouchmove = drawingTouchmove
    canvas.value!.ontouchend = drawingTouchend
  }

})

const clickTools = (index: number) => {
  msg.currentToolsIndex = index
}

const drawingDown = (e: MouseEvent) => {
  msg.isDown = true
  msg.isEnd = false
  msg.x = e.offsetX
  msg.y = e.offsetY

  // 发送消息
  ws.send(msg)

  const brush = (ctx.value as CanvasRenderingContext2D)
  if (msg.currentToolsIndex === 0) {
    brush.beginPath()
    brush.moveTo(msg.x, msg.y)
  }
  if (msg.currentToolsIndex === 1) {
    brush.clearRect(msg.x, msg.y, 10, 10)
    brush.clearRect(msg.x, msg.y, 10, -10)
    brush.clearRect(msg.x, msg.y, -10, -10)
    brush.clearRect(msg.x, msg.y, -10, 10)
  }
}

const drawingMove = (e: MouseEvent) => {
  if (msg.isDown) {
    msg.x = e.offsetX
    msg.y = e.offsetY

    // 发送消息
    ws.send(msg)

    const brush = (ctx.value as CanvasRenderingContext2D)
    if (msg.currentToolsIndex === 0) {
      brush.lineTo(msg.x, msg.y)
      // 填充颜色
      brush.strokeStyle = 'black'
      brush.stroke()
    }
    if (msg.currentToolsIndex === 1) {
      brush.clearRect(msg.x, msg.y, 10, 10)
      brush.clearRect(msg.x, msg.y, 10, -10)
      brush.clearRect(msg.x, msg.y, -10, -10)
      brush.clearRect(msg.x, msg.y, -10, 10)
    }
  }
}

const drawingUp = () => {
  msg.isDown = false
  msg.isEnd = true
  // 发送消息
  ws.send(msg)
}
addEventListener('mouseup', () => {
  msg.isDown = false
  msg.isEnd = true
  // 发送消息
  ws.send(msg)
})



// 手机适配
const drawingTouchstart = (e: TouchEvent) => {
  console.log(e);

  const pageX = e.targetTouches[0].pageX - 45
  const pageY = e.targetTouches[0].pageY - 225

  msg.isDown = true
  msg.x = pageX
  msg.y = pageY

  // 发送消息
  ws.send(msg)

  const brush = (ctx.value as CanvasRenderingContext2D)
  if (msg.currentToolsIndex === 0) {
    brush.beginPath()
    brush.moveTo(msg.x, msg.y)
  }
  if (msg.currentToolsIndex === 1) {
    brush.clearRect(msg.x, msg.y, 10, 10)
    brush.clearRect(msg.x, msg.y, 10, -10)
    brush.clearRect(msg.x, msg.y, -10, -10)
    brush.clearRect(msg.x, msg.y, -10, 10)
  }
}

const drawingTouchmove = (e: TouchEvent) => {
  if (msg.isDown) {
    const pageX = e.targetTouches[0].pageX - 45
    const pageY = e.targetTouches[0].pageY - 225

    msg.x = pageX
    msg.y = pageY

    // 发送消息
    ws.send(msg)

    const brush = (ctx.value as CanvasRenderingContext2D)
    if (msg.currentToolsIndex === 0) {
      brush.lineTo(msg.x, msg.y)
      // 填充颜色
      brush.strokeStyle = 'black'
      brush.stroke()
    }
    if (msg.currentToolsIndex === 1) {
      brush.clearRect(msg.x, msg.y, 10, 10)
      brush.clearRect(msg.x, msg.y, 10, -10)
      brush.clearRect(msg.x, msg.y, -10, -10)
      brush.clearRect(msg.x, msg.y, -10, 10)
    }
  }
}

const drawingTouchend = () => {
  msg.isDown = false
}


function IsPC() {
  //获取浏览器navigator对象的userAgent属性（浏览器用于HTTP请求的用户代理头的值）
  var info = navigator.userAgent;
  //通过正则表达式的test方法判断是否包含“Mobile”字符串
  var isPhone = /mobile/i.test(info);
  //如果包含“Mobile”（是手机设备）则返回true
  return isPhone
}
</script>

<style lang="scss" scoped>
.board {
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #eee;
  flex-direction: column;

  .title {
    font-size: 18px;
    margin: 0 0 20px 0;
  }

  .canvas {
    // width: 800px;
    // height: 500px;
    background-color: #fff;
  }

  .tools {
    width: 300px;
    height: 60px;
    background-color: rgba(255, 255, 255, 0.6);
    margin: 10px 0 0 0;
    display: flex;
    align-items: center;
    justify-content: center;

    &>div {
      margin: 0 10px;
    }

    .color {
      height: 50px;
      width: 50px;
      background-color: black;
      cursor: pointer;
    }

    .clear-rect {
      line-height: 50px;
      width: 50px;
      background-color: white;
      text-align: center;
      cursor: pointer;
    }

    .active {
      border: 1px solid red;
    }
  }
}


@media screen and (max-width: 375px) {
  .board {
    max-width: 375px !important;
    width: 100vw;
    height: 100vh !important;
    overflow: hidden;

    .canvas {
      // width: 90vw;
      // height: 60%;
    }

    .tools {
      width: 200px;
    }
  }
}
</style>