var root_url = 'https://www.flickr.com/services/rest/';
var method_getphotos_fromset = 'flickr.photosets.getPhotos'
var method_getphotoinfo = 'flickr.photos.getInfo'
var user_id = '57041930@N00'
var api_key = '32ed6f0a870feea0acaf4d05174f4cd9'
var bgimag = 'default.jpg'
function getBgImage(_cb) {
	$.ajax({
		type : 'GET',
		url : root_url,
		data : {
			format : 'json',
			method : method_getphotos_fromset, 
			api_key : api_key, 
			photoset_id : '72157649569862553',
			user_id : user_id, 
			per_page : '100', 
		},
		dataType : 'jsonp',
		jsonp : 'jsoncallback', // Flickrの場合はjsoncallback
	}).then(function(data){
		_getPhotos(data, function(res){
			info = res['photo']
			bgImageUrl = 'https://farm'+info['farm']+'.staticflickr.com/'+info['server']+'/'+info['id']+'_'+info['originalsecret']+'_o.jpg' 
			_cb(bgImageUrl);
		})
	});
}

function _getPhotos(data, _cb){
	photos = data["photoset"]['photo'];
	bgPhoto = photos[ Math.floor( Math.random() * photos.length)];
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
		success : _cb // 通信が成功した場合の処理
	});

};

function _getOrgSizeImageUrl(data){
	info = data['photo']
	bgImageUrl = 'https://farm'+info['farm']+'.staticflickr.com/'+info['server']+'/'+info['id']+'_'+info['originalsecret']+'_o.jpg' 
	bgImage = bgImageUrl;
};


