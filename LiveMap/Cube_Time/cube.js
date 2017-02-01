function cube(_xpos, _ypos, _xrot, _yrot, _zoom){
	var xpos = parseInt(_xpos);
	var ypos = parseInt(_ypos);
	var xrot = parseInt(_xrot);
	var yrot = parseInt(_yrot);
	var zoom = parseInt(_zoom);
	
	init();
	
	function init() {
		refresh();
		
		console.log(xpos,ypos);
		
		$("#cube").animate({ left: xpos + "px", top: ypos + "px" }, 100);
	}
	
	function refresh() {
		$("#cube").stop(true,true);
		$("#cube").css("-webkit-transform", "scale(" + zoom / 100 + ")" + "rotateX(" + xrot + "deg)" + "rotateY(" + yrot + "deg)");
	}
	
	this.setZoom = function (_zoom) {
		var error = false;
	
		_zoom = parseInt(_zoom);
	
		if (_zoom > 140 || _zoom < 30)
			error = true;
	
		else {
			zoom = _zoom;
			refresh();
		}
	
		return !error;
	}
	
	this.getZoom = function () {
		return zoom;
	}
	
	this.setPosition = function (_ypos, _xpos) {
		var error = true;
	
		if (_ypos != null) {
			error = false;
	
			if (typeof _ypos != "number")
				error = true;
	
			else
				ypos = _ypos;
		}
	
		if (_xpos != null) {
			error = false;
	
			if (typeof _xpos != "number")
				error = true;
	
			else
				xpos = _xpos;
		}
	
		if (!error)
			refresh();
	
		return !error;
	}
	
	this.getPosition = function () {
		var rgw = new Object();
	
		rgw.y = ypos;
		rgw.x = xpos;
	
		return rgw;
	}
	
	this.setRotation = function (_yrot, _xrot) {
		var error = true;
	
		if (_yrot!=null || _xrot!=null) {
			error = false;
	
			if (_yrot != null)
				yrot = _yrot;
	
			if (_xrot!=null)
				xrot = _xrot;
	
			if (xrot > 360)
				xrot -= 360;
	
			if (yrot > 360)
				yrot -= 360;
		}
	
		if (!error)
			refresh();
	
		return !error;
	}
	
	this.getRotation = function () {
		var rgw = new Object();
	
		rgw.y = yrot;
		rgw.x = xrot;
	
		return rgw;
	}
}