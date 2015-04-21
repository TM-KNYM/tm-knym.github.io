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
		bgImageUrl = _createBgImageUrl(info) 
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
			var size = sizes.find(_isOriginal);
			fotoInfo = {
				url: bgImageUrl,
				width: size['width'],
				height: size['height'],
			}
			_cb(fotoInfo)
		});
	});
};

function _createBgImageUrl(info){
	return 'https://farm'+info['farm']+'.staticflickr.com/'+info['server']+'/'+info['id']+'_'+info['originalsecret']+'_o.jpg' 
}

function _isOriginal(ele,index,ary){
	var o_key = 'Original';
	return o_key == ele['label']
}

