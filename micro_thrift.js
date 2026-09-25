/********* **********
Micro thrift - By Dustin Pfister - https://github.com/dustinpfister/micro_thrift

1.0) Conf          - a config object containing constants used throughout the codebase
2.0) SImg Class    - Allows for storing image assets in source
  2.1) tile_assets - SImg assets used to tile the WMap instance
  2.2) pool_assets - SImg assets used to skin ObjPool objects
3.0) ObjPool CLASS - An Object pool class used for sprite objects
4.0) Pathfinder    - Path finding based on EasyStar
5.0) WMap          - A world Map system
6.0) StateMachine  - The State Machine of the game
  6.1) boot state  - sets up the map, and other aspects of the game state
  6.2) floor state - shows the current state of the 'floor' of the thrift store
7.0) App loop      - Main application loop of the game

********** *********/
/********* **********
  1.0) Config
********** *********/
const conf = {};
// max number of display objects used for sm.pool
conf.MAX_OBJECTS = {
  worker: 1,
  customer: 3
};
conf.MAX_OBJECTS.total = conf.MAX_OBJECTS.woker + conf.MAX_OBJECTS.customer.total; 
/********* **********
  2.0) SImg Class + helper functions
********** *********/
const create_canvas_sheet = (img) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = img.width * img.px_size;
    canvas.height = Math.ceil(img.px.length / img.width) * img.px_size;
    img.px.forEach( (px,i) => {
        const x = i % img.width,
        y = Math.floor(i / img.width), 
        color = img.pallette[px];
        ctx.fillStyle = color;
        if(color){
          ctx.fillRect( x * img.px_size, y * img.px_size, img.px_size, img.px_size);
        }
    });
    return canvas;
};

class SImg {
  
  constructor( opt = {} ) {
    this.pallette = opt.pallette || [ '','black','white', 'red', 'lime', 'blue', 'yellow', 'orange', 'purple', 'cyan'];
    this.width = opt.width === undefined ? 64 : opt.width;
    this.frame_width = opt.frame_width === undefined ? 32 : opt.frame_width;
    this.px_size = opt.px_size === undefined ? 4 : opt.px_size;
    this.px = opt.px || px;
    this.frame_count = this.width / this.frame_width;
    this.canvas = create_canvas_sheet( this );
  }

  render_frame (ctx, frame_index=0, x=0, y=0, w=32, h=32) {
    const px_frame = this.px_size * this.frame_width;
    const sx = px_frame * frame_index;
    ctx.drawImage(this.canvas, sx, 0, px_frame + 0.50, px_frame + 0.50, x, y, w, h);
  }

};

/********* **********
  2.1) tile_assets
********** *********/
const simg_tiles_null = new SImg( {
  width: 64, frame_width: 16,
  px_size: 16,
  pallette: ['', 'black', 'white', '#cacaca', '#8a8a8a', '#4a4a4a', 'lime'],
  px: [
    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, 2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2, 2,2,2,2,2,3,3,3,3,2,2,2,2,3,3,3, 6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6, 
    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, 2,4,4,4,4,4,4,4,4,4,4,4,4,4,4,3, 2,2,2,2,2,3,3,3,3,2,2,2,2,3,3,3, 6,6,0,0,0,0,0,0,0,0,0,0,0,0,6,6,
    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, 2,4,3,3,3,3,3,3,3,3,3,3,3,3,3,3, 3,3,3,2,2,2,2,3,3,3,3,2,2,2,2,3, 6,0,6,0,0,0,0,0,0,0,0,0,0,6,0,6, 
    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, 2,4,3,3,3,3,3,3,3,3,3,3,3,3,3,3, 3,3,3,2,2,2,2,3,3,3,3,2,2,2,2,3, 6,0,0,6,0,0,0,0,0,0,0,0,6,0,0,6,
    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, 2,4,3,3,3,3,3,3,3,3,3,3,3,3,3,3, 2,3,3,3,3,2,2,2,2,3,3,3,3,2,2,2, 6,0,0,0,6,0,0,0,0,0,0,6,0,0,0,6,
    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, 2,4,3,3,3,3,3,3,3,3,3,3,3,3,3,3, 2,3,3,3,3,2,2,2,2,3,3,3,3,2,2,2, 6,0,0,0,0,6,0,0,0,0,6,0,0,0,0,6,
    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, 2,4,3,3,3,3,3,3,3,3,3,3,3,3,3,3, 3,2,2,2,2,3,3,3,3,2,2,2,2,3,3,3, 6,0,0,0,0,0,6,0,0,6,0,0,0,0,0,6,
    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, 2,4,3,3,3,3,3,3,3,3,3,3,3,3,3,3, 3,2,2,2,2,3,3,3,3,2,2,2,2,3,3,3, 6,0,0,0,0,0,0,6,6,0,0,0,0,0,0,6,
    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, 2,4,3,3,3,3,3,3,3,3,3,3,3,3,3,3, 2,3,3,3,3,2,2,2,2,3,3,3,3,2,2,2, 6,0,0,0,0,0,0,6,6,0,0,0,0,0,0,6,
    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, 2,4,3,3,3,3,3,3,3,3,3,3,3,3,3,3, 2,3,3,3,3,2,2,2,2,3,3,3,3,2,2,2, 6,0,0,0,0,0,6,0,0,6,0,0,0,0,0,6,
    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, 2,4,3,3,3,3,3,3,3,3,3,3,3,3,3,3, 3,2,2,2,2,3,3,3,3,2,2,2,2,3,3,3, 6,0,0,0,0,6,0,0,0,0,6,0,0,0,0,6,
    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, 2,4,3,3,3,3,3,3,3,3,3,3,3,3,3,3, 3,2,2,2,2,3,3,3,3,2,2,2,2,3,3,3, 6,0,0,0,6,0,0,0,0,0,0,6,0,0,0,6,
    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, 2,4,3,3,3,3,3,3,3,3,3,3,3,3,3,3, 2,3,3,3,3,2,2,2,2,3,3,3,3,2,2,2, 6,0,0,6,0,0,0,0,0,0,0,0,6,0,0,6,
    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, 2,4,3,3,3,3,3,3,3,3,3,3,3,3,3,3, 2,3,3,3,3,2,2,2,2,3,3,3,3,2,2,2, 6,0,6,0,0,0,0,0,0,0,0,0,0,6,0,6,
    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, 2,4,3,3,3,3,3,3,3,3,3,3,3,3,3,3, 3,2,2,2,2,3,3,3,3,2,2,2,2,3,3,3, 6,6,0,0,0,0,0,0,0,0,0,0,0,0,6,6,
    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, 2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3, 3,2,2,2,2,3,3,3,3,2,2,2,2,3,3,3, 6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6
  ] } );

const simg_tiles_stock = new SImg( {
  width: 48, frame_width: 16,
  px_size: 16,
  pallette: ['', 'black', 'white', 'tan', 
  'red', 'lime', 'blue', 'yellow', 'cyan', 'purple'],
  px: [
    3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3, 3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3, 3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3, 
    3,3,2,2,2,2,2,2,2,2,2,2,2,2,3,3, 3,3,5,5,5,2,2,2,2,2,2,2,6,6,3,3, 3,3,5,5,5,2,2,2,2,2,2,2,6,6,3,3, 
    3,3,2,2,2,2,2,2,2,2,2,2,2,2,3,3, 3,3,5,5,5,4,4,2,2,2,2,2,6,6,3,3, 3,3,5,5,5,4,4,7,7,4,4,4,6,6,3,3, 
    3,3,2,2,2,2,2,2,2,2,2,2,2,2,3,3, 3,3,5,5,5,4,4,2,2,2,2,2,6,6,3,3, 3,3,5,5,5,4,4,7,7,4,4,4,6,6,3,3, 
    3,3,2,2,2,2,2,2,2,2,2,2,2,2,3,3, 3,3,2,2,2,2,2,2,2,2,2,2,2,2,3,3, 3,3,2,2,2,2,2,2,2,2,2,2,2,2,3,3, 
    3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3, 3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3, 3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3, 
    3,3,2,2,2,2,2,2,2,2,2,2,2,2,3,3, 3,3,2,2,2,2,2,2,2,2,2,2,2,2,3,3, 3,3,2,2,2,2,2,2,2,2,2,2,2,2,3,3, 
    3,3,2,2,2,2,2,2,2,2,2,2,2,2,3,3, 3,3,2,2,2,2,2,2,2,2,2,2,2,2,3,3, 3,3,2,2,8,8,8,8,2,2,2,5,4,4,3,3, 
    3,3,2,2,2,2,2,2,2,2,2,2,2,2,3,3, 3,3,2,2,2,2,2,2,4,4,2,2,4,4,3,3, 3,3,7,7,8,8,8,8,4,4,5,5,4,4,3,3, 
    3,3,2,2,2,2,2,2,2,2,2,2,2,2,3,3, 3,3,2,2,2,2,2,2,4,4,2,2,4,4,3,3, 3,3,7,7,8,8,8,8,4,4,5,5,4,4,3,3, 
    3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3, 3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3, 3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3, 
    3,3,2,2,2,2,2,2,2,2,2,2,2,2,3,3, 3,3,2,2,2,2,2,2,2,2,2,2,2,2,3,3, 3,3,2,2,2,2,2,2,2,2,2,2,2,2,3,3, 
    3,3,2,2,2,2,2,2,2,2,2,2,2,2,3,3, 3,3,2,2,2,2,2,2,2,2,2,2,2,2,3,3, 3,3,2,2,9,9,2,2,9,9,2,2,9,9,3,3, 
    3,3,2,2,2,2,2,2,2,2,2,2,2,2,3,3, 3,3,4,4,2,2,2,2,2,2,2,2,2,2,3,3, 3,3,4,4,9,9,4,4,9,9,4,4,9,9,3,3, 
    3,3,2,2,2,2,2,2,2,2,2,2,2,2,3,3, 3,3,4,4,2,2,2,2,2,2,2,2,2,2,3,3, 3,3,4,4,9,9,4,4,9,9,4,4,9,9,3,3, 
    3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3, 3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3, 3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3
  ] } );

/********* **********
  2.2) pool_assets
********** *********/
const simg_pool_customer = new SImg( {
  width: 16, frame_width: 16, px_size: 16, pallette: ['', 'black', 'white', '#cacaca', '#8a8a8a', '#4a4a4a', 'lime', 'cyan'],
  px: [
    6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,
    6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6,
    6,0,0,6,6,6,6,0,0,0,0,0,0,0,0,6,
    6,0,6,6,0,0,0,0,0,0,0,0,0,0,0,6,
    6,0,6,6,0,0,0,0,0,0,0,0,0,0,0,6,
    6,0,6,6,0,0,0,0,0,0,0,0,0,0,0,6,
    6,0,0,6,6,6,6,0,0,0,0,0,0,0,0,6,
    6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6,
    6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6,
    6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6,
    6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6,
    6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6,
    6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6,
    6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6,
    6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6,
    6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6
  ] } );

const simg_pool_worker = new SImg( {
  width: 16, frame_width: 16, px_size: 16, pallette: ['', 'black', 'white', '#cacaca', '#8a8a8a', '#4a4a4a', 'lime', 'cyan'],
  px: [
    7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,
    7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,7,
    7,0,7,0,0,0,0,7,0,0,0,0,0,0,0,7,
    7,0,7,0,7,7,0,7,0,0,0,0,0,0,0,7,
    7,0,7,0,7,7,0,7,0,0,0,0,0,0,0,7,
    7,0,0,7,0,0,7,0,0,0,0,0,0,0,0,7,
    7,0,0,7,0,0,7,0,0,0,0,0,0,0,0,7,
    7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,7,
    7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,7,
    7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,7,
    7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,7,
    7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,7,
    7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,7,
    7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,7,
    7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,7,
    7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7
  ] } );

/********* **********
  3.0) ObjPool CLASS
********** *********/
class ObjPool {
  //constructor ( count = 10, simg = simg_tiles_null ) {
  constructor ( opt= {} ) {
    this.count = opt.count || 10;
    //this.simg = opt.simg || simg_pool_customer;
    this.sheets = opt.sheets || [simg_pool_customer];
    this.objects = [];
    let i = 0;
    while(i < this.count){
      const obj = {
        x: 0, y: 0, w: opt.w || 32, h: opt.h || 32,
        frame_index: opt.frame_index || 0,
        active: false,
        simg : opt.sheet_index ? this.sheets[ opt.sheet_index ] : this.sheets[0],
        heading: Math.PI * 0.5, 
        data: {},     // standard place to park app specfic data
        pps : 32,     // pixels per second
        fps: 4        // frames per second
      };
      this.objects.push(obj);
      i += 1;
    }
  }
  
  get_inactive(){
    let i = 0;
    while(i < this.count){
      const obj = this.objects[i];
      if(!obj.active){
        return obj;
      }
      i += 1;
    }
    return null;
  };
  
  get_data_count (data_key='type', value='customer') {
    return this.objects.reduce( ( acc, obj ) => {  
      if(obj.data[data_key] === value){
          return acc + 1;
      }
      return acc;
    }, 0);
  }

  update ( ctx, t=0, for_obj=()=>{} ) {
    let i = 0, len = this.objects.length;
    while(i < len){
      const obj = this.objects[i];
      if(!obj.active){
        obj.x = -1000;
        obj.y = -1000;
      }
      if(obj.active){
        obj.x += obj.pps * Math.cos(obj.heading) * ( t / 1000 );
        obj.y += obj.pps * Math.sin(obj.heading) * ( t / 1000 );
      }
      for_obj(obj, i);
      //this.render_object(ctx, i);
      i += 1;
    }
  }

  render (ctx) {
    let i = 0, len = this.objects.length;
    while(i < len){
        this.render_object(ctx, i);
        i += 1;
    }
  }

  render_object (ctx, index=0) {
    const obj = this.objects[index];
    if(obj.active){
      obj.simg.render_frame(ctx, 
        Math.floor(obj.frame_index), 
        obj.x, obj.y, obj.w, obj.h
      );
    }
  }

}

/********* **********
  4.0) PathFinder
********** *********/
// This is based on what I found here
// PathFinder License: MIT.
// Copyright (c) 2013 appsbu-de
// https://github.com/appsbu-de/phaser_plugin_pathfinding

const EasyStar = {};

EasyStar.Node = function(parent, x, y, costSoFar, simpleDistanceToTarget) {
    this.parent = parent;
    this.x = x;
    this.y = y;
    this.costSoFar = costSoFar;
    this.simpleDistanceToTarget = simpleDistanceToTarget;
    this.bestGuessDistance = function() {
        return this.costSoFar + this.simpleDistanceToTarget;
    }
};

EasyStar.Node.OPEN_LIST = 0;
EasyStar.Node.CLOSED_LIST = 1;

EasyStar.PriorityQueue = function(criteria,heapType) {
    this.length = 0; //The current length of heap.
    var queue = [];
    var isMax = false;
    if (heapType==EasyStar.PriorityQueue.MAX_HEAP) {
        isMax = true;
    } else if (heapType==EasyStar.PriorityQueue.MIN_HEAP) {
        isMax = false;
    } else {
        throw heapType + " not supported.";
    }

    this.insert = function(value) {
        if (!value.hasOwnProperty(criteria)) {
            throw "Cannot insert " + value + " because it does not have a property by the name of " + criteria + ".";
        }
        queue.push(value);
        this.length++;
        bubbleUp(this.length-1);
    }

    this.getHighestPriorityElement = function() {
        return queue[0];
    }

    this.shiftHighestPriorityElement = function() {
        if (this.length === 0) {
            throw ("There are no more elements in your priority queue.");
        } else if (this.length === 1) {
            var onlyValue = queue[0];
            queue = [];
            this.length = 0;
            return onlyValue;
        }
        var oldRoot = queue[0];
        var newRoot = queue.pop();
        this.length--;
        queue[0] = newRoot;
        swapUntilQueueIsCorrect(0);
        return oldRoot;
    }

    var bubbleUp = function(index) {
        if (index===0) {
            return;
        }
        var parent = getParentOf(index);
        if (evaluate(index,parent)) {
            swap(index,parent);
            bubbleUp(parent);
        } else {
            return;
        }
    }

    var swapUntilQueueIsCorrect = function(value) {
        var left = getLeftOf(value);
        var right = getRightOf(value);
        if (evaluate(left,value)) {
            swap(value,left);
            swapUntilQueueIsCorrect(left);
        } else if (evaluate(right,value)) {
            swap(value,right);
            swapUntilQueueIsCorrect(right);
        } else if (value==0) {
            return;
        } else {
            swapUntilQueueIsCorrect(0);
        }
    }

    var swap = function(self,target) {
        var placeHolder = queue[self];
        queue[self] = queue[target];
        queue[target] = placeHolder;
    }

    var evaluate = function(self,target) {
        if (queue[target]===undefined||queue[self]===undefined) {
            return false;
        }		
        var selfValue;
        var targetValue;		
        //Check if the criteria should be the result of a function call.
        if (typeof queue[self][criteria] === 'function') {
            selfValue = queue[self][criteria]();
            targetValue = queue[target][criteria]();
        } else {
            selfValue = queue[self][criteria];
            targetValue = queue[target][criteria];
        }
        if (isMax) {
            if (selfValue > targetValue) {
                return true;
            } else {
                return false;
            }
        } else {
            if (selfValue < targetValue) {
                return true;
            } else {
                return false;
            }
        }
    }

    var getParentOf = function(index) {
        return Math.floor(index/2)-1;
    }

    var getLeftOf = function(index) {
        return index*2 + 1;
    }

    var getRightOf = function(index) {
        return index*2 + 2;
    }
};

EasyStar.PriorityQueue.MAX_HEAP = 0;
EasyStar.PriorityQueue.MIN_HEAP = 1;

EasyStar.instance = function() {
    this.isDoneCalculating = true;
    this.pointsToAvoid = {};
    this.startX;
    this.callback;
    this.startY;
    this.endX;
    this.endY;
    this.nodeHash = {};
    this.openList;
};
EasyStar.js = function() {
    var STRAIGHT_COST = 10;
    var DIAGONAL_COST = 14;
    var pointsToAvoid = {};
    var collisionGrid;
    var costMap = {};
    var iterationsSoFar;
    var instances = [];
    var iterationsPerCalculation = Number.MAX_VALUE;
    var acceptableTiles;
    var diagonalsEnabled = false;

    this.setAcceptableTiles = function(tiles) {
        if (tiles instanceof Array) {
            //Array
            acceptableTiles = tiles;
        } else if (!isNaN(parseFloat(tiles)) && isFinite(tiles)) {
            //Number
            acceptableTiles = [tiles];
        }
    };

    this.enableDiagonals = function() {
        diagonalsEnabled = true;
    }

    this.disableDiagonals = function() {
        diagonalsEnabled = false;
    }

    this.setGrid = function(grid) {
        collisionGrid = grid;
        //Setup cost map
        for (var y = 0; y < collisionGrid.length; y++) {
            for (var x = 0; x < collisionGrid[0].length; x++) {
                if (!costMap[collisionGrid[y][x]]) {
                    costMap[collisionGrid[y][x]] = 1
                }
            }
        }
    };

    this.setTileCost = function(tileType, cost) {
        costMap[tileType] = cost;
    };

    this.setIterationsPerCalculation = function(iterations) {
        iterationsPerCalculation = iterations;
    };
	
    this.avoidAdditionalPoint = function(x, y) {
        pointsToAvoid[x + "_" + y] = 1;
    };

    this.stopAvoidingAdditionalPoint = function(x, y) {
        delete pointsToAvoid[x + "_" + y];
    };

    this.stopAvoidingAllAdditionalPoints = function() {
        pointsToAvoid = {};
    };

    this.findPath = function(startX, startY ,endX, endY, callback) {
        //No acceptable tiles were set
        if (acceptableTiles === undefined) {
            throw "You can't set a path without first calling setAcceptableTiles() on EasyStar.";
        }
        //No grid was set
        if (collisionGrid === undefined) {
            throw "You can't set a path without first calling setGrid() on EasyStar.";
        }
        //Start or endpoint outside of scope.
        // I fixed what I think is a bug here ~Dustin
        if (startX < 0 || startY < 0 || endX < 0 || endY < 0 || 
        startX > collisionGrid[0].length-1 || startY > collisionGrid.length-1 || 
        endX > collisionGrid[0].length-1 || endY > collisionGrid.length-1) {        
            
            throw "Your start or end point is outside the scope of your grid.";
        }
        //Start and end are the same tile.
        if (startX===endX && startY===endY) {
            callback([]);
        }
        //End point is not an acceptable tile.
        var endTile = collisionGrid[endY][endX];
        var isAcceptable = false;
        for (var i = 0; i < acceptableTiles.length; i++) {
            if (endTile === acceptableTiles[i]) {
                isAcceptable = true;
                break;
            }
        }
        if (isAcceptable === false) {
            callback(null);
            return;
        }
        //Create the instance
        var instance = new EasyStar.instance();
        instance.openList = new EasyStar.PriorityQueue("bestGuessDistance",EasyStar.PriorityQueue.MIN_HEAP);
        instance.isDoneCalculating = false;
        instance.nodeHash = {};
        instance.startX = startX;
        instance.startY = startY;
        instance.endX = endX;
        instance.endY = endY;
        instance.callback = callback;
        instance.openList.insert(coordinateToNode(instance, instance.startX, 
            instance.startY, null, STRAIGHT_COST));
        instances.push(instance);
    };

    this.calculate = function() {
        if (instances.length === 0 || collisionGrid === undefined || acceptableTiles === undefined) {
            return;
        }
        for (iterationsSoFar = 0; iterationsSoFar < iterationsPerCalculation; iterationsSoFar++) {
            if (instances.length === 0) {
                return;
            }
            //Couldn't find a path.
            if (instances[0].openList.length===0) {
                instances[0].callback(null);
                instances.shift();
                continue;
            }
            var searchNode = instances[0].openList.shiftHighestPriorityElement();
            searchNode.list = EasyStar.Node.CLOSED_LIST;
            if (searchNode.y > 0) {
                checkAdjacentNode(instances[0], searchNode, 0, -1, STRAIGHT_COST * 
                    costMap[collisionGrid[searchNode.y-1][searchNode.x]]);
                if (instances[0].isDoneCalculating===true) {
                    instances.shift();
                    continue;
                }
            }
            if (searchNode.x < collisionGrid[0].length-1) {
                checkAdjacentNode(instances[0], searchNode, 1, 0, STRAIGHT_COST *
                    costMap[collisionGrid[searchNode.y][searchNode.x+1]]);
                if (instances[0].isDoneCalculating===true) {
                    instances.shift();
                    continue;
                }
            }
            if (searchNode.y < collisionGrid.length-1) {
                checkAdjacentNode(instances[0], searchNode, 0, 1, STRAIGHT_COST *
                    costMap[collisionGrid[searchNode.y+1][searchNode.x]]);
                if (instances[0].isDoneCalculating===true) {
                    instances.shift();
                    continue;
                }
            }
            if (searchNode.x > 0) {
                checkAdjacentNode(instances[0], searchNode, -1, 0, STRAIGHT_COST *
                    costMap[collisionGrid[searchNode.y][searchNode.x-1]]);
                if (instances[0].isDoneCalculating===true) {
                    instances.shift();
                    continue;
                }
            }
            if (diagonalsEnabled) {
                if (searchNode.x > 0 && searchNode.y > 0) {
                    checkAdjacentNode(instances[0], searchNode, -1, -1,  DIAGONAL_COST *
                        costMap[collisionGrid[searchNode.y-1][searchNode.x-1]]);
                    if (instances[0].isDoneCalculating===true) {
                        instances.shift();
                        continue;
                    }
                }
                if (searchNode.x < collisionGrid[0].length-1 && searchNode.y < collisionGrid.length-1) {
                    checkAdjacentNode(instances[0], searchNode, 1, 1, DIAGONAL_COST *
                        costMap[collisionGrid[searchNode.y+1][searchNode.x+1]]);
                    if (instances[0].isDoneCalculating===true) {
                        instances.shift();
                        continue;
                    }
                }
                if (searchNode.x < collisionGrid[0].length-1 && searchNode.y > 0) {
                    checkAdjacentNode(instances[0], searchNode, 1, -1, DIAGONAL_COST *
                        costMap[collisionGrid[searchNode.y-1][searchNode.x+1]]);
                    if (instances[0].isDoneCalculating===true) {
                        instances.shift();
                        continue;
                    }
                }
                if (searchNode.x > 0 && searchNode.y < collisionGrid.length-1) {
                    checkAdjacentNode(instances[0], searchNode, -1, 1, DIAGONAL_COST *
                        costMap[collisionGrid[searchNode.y+1][searchNode.x-1]]);
                    if (instances[0].isDoneCalculating===true) {
                        instances.shift();
                        continue;
                    }
                }
            }
        }
    };

    var checkAdjacentNode = function(instance, searchNode, x, y, cost) {
        var adjacentCoordinateX = searchNode.x+x;
        var adjacentCoordinateY = searchNode.y+y;
		
        if (instance.endX === adjacentCoordinateX && instance.endY === adjacentCoordinateY) {
            instance.isDoneCalculating = true;
            var path = [];
            var pathLen = 0;
            path[pathLen] = {x: adjacentCoordinateX, y: adjacentCoordinateY};
            pathLen++;
            path[pathLen] = {x: searchNode.x, y:searchNode.y};
            pathLen++;
            var parent = searchNode.parent;
            while (parent!=null) {
                path[pathLen] = {x: parent.x, y:parent.y};
                pathLen++;
                parent = parent.parent;
            }
            path.reverse();
            instance.callback(path);
        }

        if (pointsToAvoid[adjacentCoordinateX + "_" + adjacentCoordinateY] === undefined) {
            for (var i = 0; i < acceptableTiles.length; i++) {
                if (collisionGrid[adjacentCoordinateY][adjacentCoordinateX] === acceptableTiles[i]) {
					
                    var node = coordinateToNode(instance, adjacentCoordinateX, 
                        adjacentCoordinateY, searchNode, cost);
					
                    if (node.list === undefined) {
                        node.list = EasyStar.Node.OPEN_LIST;
                        instance.openList.insert(node);
                    } else if (node.list === EasyStar.Node.OPEN_LIST) {
                        if (searchNode.costSoFar + cost < node.costSoFar) {
                            node.costSoFar = searchNode.costSoFar + cost;
                            node.parent = searchNode;
                        }
                    }
                    break;
                }
            }

        }
    };

    var coordinateToNode = function(instance, x, y, parent, cost) {
        if (instance.nodeHash[x + "_" + y]!==undefined) {
            return instance.nodeHash[x + "_" + y];
        }
        var simpleDistanceToTarget = getDistance(x, y, instance.endX, instance.endY);
        if (parent!==null) {
            var costSoFar = parent.costSoFar + cost;
        } else {
            costSoFar = simpleDistanceToTarget;
        }
        var node = new EasyStar.Node(parent,x,y,costSoFar,simpleDistanceToTarget);
        instance.nodeHash[x + "_" + y] = node;
        return node;
    };

    var getDistance = function(x1,y1,x2,y2) {
        return Math.sqrt(Math.abs(x2-x1)*Math.abs(x2-x1) + Math.abs(y2-y1)*Math.abs(y2-y1)) * STRAIGHT_COST;
    };
}


class PathFinder {

    constructor () {
        if (typeof EasyStar !== 'object') {
            throw new Error("Easystar is not defined!");
        }
        this.parent = parent;
        this._easyStar = new EasyStar.js();
        this._grid = null;
        this._callback = null;
        this._prepared = false;
        this._walkables = [0];
    }
        
    setGrid (grid, walkables, iterationsPerCount) {
        iterationsPerCount = iterationsPerCount || null;
        this._grid = [];
        for (var i = 0; i < grid.length; i++) {
            this._grid[i] = [];
            for (var j = 0; j < grid[i].length; j++){
                if (grid[i][j])
                this._grid[i][j] = grid[i][j].index;
            else
                this._grid[i][j] = 0
            }
        }
        this._walkables = walkables;
        this._easyStar.setGrid(this._grid);
        this._easyStar.setAcceptableTiles(this._walkables);
        // initiate all walkable tiles with cost 1 so they will be walkable even if they are not on the grid map, jet.
        for (i = 0; i < walkables.length; i++){
            this.setTileCost(walkables[i], 1);
        }
        if (iterationsPerCount !== null) {
            this._easyStar.setIterationsPerCalculation(iterationsPerCount);
        }
    }
        
    setTileCost (tileType, cost) {
        this._easyStar.setTileCost(tileType, cost);
    }
        
    setCallbackFunction (callback) {
        this._callback = callback;
    }
        
    preparePathCalculation (from, to) {
        if (this._callback === null || typeof this._callback !== "function") {
            throw new Error("No Callback set!");
        }

        var startX = from[0],
        startY = from[1],
        destinationX = to[0],
        destinationY = to[1];

        this._easyStar.findPath(startX, startY, destinationX, destinationY, this._callback);
        this._prepared = true;
    }
        
    calculatePath  () {
        if (this._prepared === null) {
            throw new Error("no Calculation prepared!");
        }

        this._easyStar.calculate();
    }

}

/********* **********
  5.0) WMap world map system
********** *********/

class WMap {

  constructor ( opt={} ) {
    this.parse_data = opt.parse_data || function(){};
    this.width = opt.width === undefined ? 16 : opt.width;
    this.height = opt.height === undefined ? 16 : opt.height;
    this.default_type = opt.default_type || 0;
    this.sx = opt.sx === undefined ? 20 : opt.sx;
    this.sy = opt.sy === undefined ? 20 : opt.sy;
    this.tile_size = opt.tile_size || 32;
    this.sheets = opt.sheets || [ simg_tiles_null ];
    this.type_index = opt.type_index || [ 
      [0,0], [0,1], [0,3]
    ];
    this.walkables = opt.walkables || [0];
    this.grid = [];
    let i = 0;
    const len = this.width * this.height;
    const tile_data = opt.tile_data || [];
    while(i < len){
      const x = i % this.width;
      const y = Math.floor(i / this.width);
      const tile = {
          //type_index: tile_data[i] || 0,
          type_index: this.default_type,
          x: x, y: y, i: 1,
          data: {}
      };
      if(opt.data){
        this.parse_data(this, opt.data[i], tile, i);
      }
      tile.sheet_index = this.type_index[ tile.type_index ][0];
      tile.frame_index = this.type_index[ tile.type_index ][1];
      this.grid.push(tile);
      i += 1;
    }
  }

  get(ix, y){
    if(arguments.length === 1 && ix >=0 && ix < this.grid.length){
        return this.grid[ix]
    }
    const tile = this.grid[ y * this.width + ix ];
    if(tile){
        return tile;
    }
    return null;
  }

  getByPX (px, py) {
    const x = Math.floor( ( px - this.sx ) / this.tile_size);
    const y = Math.floor( ( py - this.sy ) / this.tile_size);
    return this.get(x, y);
  }

  getPath (x1=0, y1=0, x2=0, y2=0) {
    const pf = new PathFinder();
    const grid = this.getPathData();
    return new Promise( (resolve, reject)=> {
      pf.setCallbackFunction( function( a) {
        resolve(a);
      });
      pf.setGrid(grid, [0]);
      pf.preparePathCalculation([x1,y1], [x2,y2]);
      pf.calculatePath();
    });
  }

  getPathData () {
    const types = this.grid.map( (obj) => {
        return obj.type_index;
    });
    const map = this;
    const data = [];
    let y = 0;
    while(y < this.height){
        const i = y * this.width;
        data[y] = types.slice( i, i + this.width ).map((n)=>{
            return map.walkables.some((a)=>{
                return a === n;
            }) ? 0 : 1;
        });
        y += 1;
    }
    return data;
  }

  getRandomByType ( types=[0,1] ) {
    const options = this.grid.filter(function(obj){
      return types.some(function(n){
        return obj.type_index === n;
      })
    });
    return options[ Math.floor( Math.random() * options.length ) ];
  }

  render_grid (ctx ) {
    let i = 0;
    const len = this.width * this.height;
    while(i < len){
      const tile = this.grid[i];
      const simg = this.sheets[ tile.sheet_index ];
      const s = this.tile_size;
      simg.render_frame(ctx, tile.frame_index, this.sx + tile.x * s, this.sy + tile.y * s, s, s);
      i += 1;
    }
  }

  snap_to_grid (obj) {
      if(obj.x < this.sx){
        obj.x = this.sx;
      }
      if(obj.y < this.sy){
        obj.y = this.sy;
      }
      obj.x = this.sx + Math.floor( ( obj.x - this.sx ) / this.tile_size) * this.tile_size;
      obj.y = this.sy + Math.floor( ( obj.y - this.sy ) / this.tile_size) * this.tile_size;
  }

}

/********* **********
  6.0) StateMachine
********** *********/
const StateMachine = {
    current_key: 'boot',
    current: null,
    saves: {},
    states: {}
};

StateMachine.set_state = function (key='boot') {
    const sm = this;
    sm.current_key = key;
    const state = sm.current = sm.states[sm.current_key];
    state.init.call(sm, sm);
    state.update.call(sm, sm, 0);
};

StateMachine.update = function(t=0){
    this.current.update.call(this, this, t);
};

StateMachine.render = function(ctx, canvas){
    const sm = this, state = sm.current;
    ctx.fillStyle = 'black';
    ctx.fillRect(0,0, canvas.width, canvas.height);
    state.render.call(sm, sm, ctx, canvas);

};

StateMachine.pointer = function (e) {
  const bx = e.target.getBoundingClientRect()
  const x = e.clientX - bx.left;
  const y = e.clientY - bx.top;
  const sm = this, state = sm.current;
  state.pointer.call(sm, sm, x, y, e)
};

// spawn an object_type for sm.pool
StateMachine.spawn = function (object_type='customer') {
  const sm = this;
  const type_count = sm.pool.get_data_count('type', object_type);
  if(type_count < conf.MAX_OBJECTS[object_type]){
    //const obj = sm.pool.objects[0];
    const obj = sm.pool.get_inactive();
    if(obj){
      const map = sm.map;
      obj.active = true;
      obj.data.type = object_type;
      const pos = map.getRandomByType([1]);
      obj.x = map.sx + pos.x * map.tile_size;
      obj.y = map.sy + pos.y * map.tile_size;  
      obj.simg = sm.pool.sheets[object_type === 'customer' ? 0 : 1];
    }
  }
};

/********* **********
  6.1) boot state
********** *********/
StateMachine.states.boot = {

  pointer : function(sm, x, y, e) {
  },

  init: function(sm) {
  
    sm.pool = new ObjPool({
      count: conf.MAX_OBJECTS.total, w: 24, h: 24, sheets:[simg_pool_customer, simg_pool_worker]
    });
    
    sm.map = new WMap({
      width: 16, height: 16,
      sx: 10, sy: 10,
      default_type: 1,
      sheets: [simg_tiles_null, simg_tiles_stock],
      type_index: [
        [0,0], // type 0, sheet 0, frame 0
        [0,1], // floor tile
        [0,2], // wall
        [1,0], // empty shelf
        [1,1], // half full
        [1,2]  // full
      ],
      tile_size : 24,
      walkables: [0, 1],
      data:
        ('t01,t01,t01,t01,t01,t01,t01,t01,t01,t01,t01,t01,t01,t01,t01,t01,' +
         't01,c01,t01,c01,t01,c01,t01,c01,t01,t01,t01,t01,t01,t01,t01,t01,' +
         't01,c01,t01,c01,t01,c01,t01,c01,t01,t01,c01,c01,c01,t01,t01,t01,' +
         't01,c01,t01,c01,t01,c01,t01,c01,t01,t01,c01,c01,c01,t01,t01,t01,' +
         't01,c01,t01,c01,t01,c01,t01,c01,t01,t01,t01,t01,t01,t01,t01,t01,' +
         't01,t01,t01,t01,t01,t01,t01,t01,t01,t01,t01,t01,t01,t01,t01,c01,' +
         'c01,t01,c01,c01,c01,c01,c01,c01,t01,t01,c01,t01,c01,t01,t01,c01,' +
         'c01,t01,t01,t01,t01,t01,t01,t01,t01,t01,t01,t01,t01,t01,t01,c01,' +
         'c01,t01,c01,c01,c01,c01,c01,c01,t01,t01,c01,t01,c01,t01,t01,c01,' +
         'c01,t01,t01,t01,t01,t01,t01,t01,t01,t01,t01,t01,t01,t01,t01,c01,' +
         'c01,c01,c01,c01,c01,c01,c01,c01,t01,t01,c01,c01,c01,c01,c01,c01,' +
         't02,t02,t02,t02,t02,t02,t02,t02,t01,t01,t02,t02,t02,t02,t02,t02,' +
         't01,t01,t01,t01,t01,t01,t01,t01,t01,t01,t01,t01,t01,t01,t01,t01,' +
         't01,t01,t01,t01,t01,t01,t01,t01,t01,t01,t01,t01,t01,t01,t01,t01,' +
         't01,t01,t01,t01,t01,t01,t01,t01,t01,t01,t01,t01,t01,t01,t01,t01,' +
         't01,t01,t01,t01,t01,t01,t01,t01,t01,t01,t01,t01,t01,t01,t01,t01,' +
         't01,t01,t01,t01,t01,t01,t01,t01,t01,t01,t01,t01,t01,t01,t01,t01,').split(','),
      parse_data : (map, tData, tile, i) => {
          tile.data.count = 0;
          if(tData[0] === 't'){
            tile.type_index = parseInt( tData.slice(1, 3) );
          }
          if(tData[0] === 'c'){
            tile.type_index = 3;
            const n = parseInt( tData.slice(1, 3) );
            tile.data.count = n;
            tile.type_index = n > 0 ? 4 : tile.type_index;
            tile.type_index = n >= 50 ? 5 : tile.type_index;
          }
      }
    });
    
    StateMachine.set_state('floor');
    
  },

  update: function(sm, t) {},

  render: function(sm, ctx, canvas) {}

};

/********* **********
  6.2) floor State
********** *********/

StateMachine.states.floor = {

  pointer : function(sm, x, y, e) {
     console.log(sm.current_key + 'pointer: ');
     console.log( sm.map.getByPX(x, y));
  },

  init: function(sm) {},

  update: function(sm, t) {
    const map = sm.map;
    
    sm.spawn('customer');
    sm.spawn('worker');
    
    sm.pool.update(ctx, 0, function(obj){
      const path = obj.data.path = obj.data.path || [];
      
      if(obj.active && path.length === 0){
        const pos1 = {
            x: (obj.x - map.sx) / map.tile_size,
            y: (obj.y - map.sy) / map.tile_size
        }
        const pos2 = map.getRandomByType([1]);
        map.getPath(pos2.x,pos2.y,pos1.x,pos1.y)
        .then((path_new)=>{
          obj.data.path = path_new;
        });
      }
      if(obj.active && path.length > 0){
        const pos = path.pop();
        obj.x = map.sx + pos.x * map.tile_size;
        obj.y = map.sy + pos.y * map.tile_size;
      }
    });
  },

  render: function(sm, ctx, canvas) {
    sm.map.render_grid(ctx);
    sm.pool.render(ctx);
  }

};

/********* **********
  7.0) APP LOOP
********** *********/
const canvas = document.getElementById('the_canvas'); //document.createElement('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 640;
canvas.height = 480;


canvas.addEventListener('click', function(e)  {
  StateMachine.pointer(e);
});

document.body.appendChild(canvas);


let = lt = new Date();
const loop = () => {
  const now = new Date();
  const t = now - lt;
  requestAnimationFrame(loop);
  if(t >= 250){
    lt = now;
    StateMachine.update(t);
    StateMachine.render(ctx, canvas);
  }
};
StateMachine.set_state('boot');
loop();



