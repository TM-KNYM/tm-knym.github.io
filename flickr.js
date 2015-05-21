var root_url = 'https://www.flickr.com/services/rest/';
var method_getphotos_fromset = 'flickr.photosets.getPhotos'
var method_getphotoinfo = 'flickr.photos.getInfo'
var method_getsizes = 'flickr.photos.getSizes'
var user_id = '57041930@N00'
var api_key = '32ed6f0a870feea0acaf4d05174f4cd9'
var bgimag = 'default.jpg'
var photoset_id = '72157649569862553'

function getBgImageInfo(_cb) {
	$.ajax({
		type : 'GET',
		url : root_url,
		data : {
			format : 'json',
			method : method_getphotos_fromset, 
			api_key : api_key, 
			photoset_id : photoset_id,
			user_id : user_id, 
			per_page : '100', 
		},
		dataType : 'jsonp',
		jsonp : 'jsoncallback', 
	}).then(function(data){
		_getPhotoInfo(data, function(res){
			_cb(res);
		})
	});
}
function _find2kSize(sizes){
	for(var i=0;i<sizes.length; i++){
		if(_is2k(sizes[i])) return sizes[i];
	}
	return undefined;
};

function _is2k(ele){
	var o_key = 'Large 2048';
	return o_key == ele['label']
}

function _getPhotoInfo(data, _cb){
	photos = data["photoset"]['photo'];
	bgPhoto = photos[ Math.floor( Math.random() * photos.length)];
	var bgImageUrl; 
	$.ajax({
		type : 'GET',
		url : root_url,
		data : {
			format : 'json',
			method : method_getphotoinfo,
			api_key : api_key, 
			photo_id : bgPhoto['id'],
		},
		dataType : 'jsonp',
		jsonp : 'jsoncallback', // Flickrの場合はjsoncallback
	}).then(function(res){
		var info = res['photo']
		$.ajax({
				type : 'GET',
				url : root_url,
				data : {
					format : 'json',
					method : method_getsizes,
					api_key : api_key, 
					photo_id : info['id'],
				},
				dataType : 'jsonp',
				jsonp : 'jsoncallback', // Flickrの場合はjsoncallback
		}).then(function(data){
			var sizes = data['sizes']['size'];
			var size = _find2kSize(sizes);
			fotoInfo = {
				url: size["source"],
				width: size['width'],
				height: size['height'],
			}
			_cb(fotoInfo)
		});
	});
};


