export default {
	props: {
		avatarSrc: {
			type: String,
			default: ''
		},
		avatarStyle: {
			type: Object,
			default: () => ({})
		},
		selWidth: {
			type: String,
			default: '300rpx'
		},
		selHeight: {
			type: String,
			default: '300rpx'
		},
		expWidth: {
			type: String,
			default: '300rpx'
		},
		expHeight: {
			type: String,
			default: '300rpx'
		},
		minScale: {
			type: Number,
			default: 0.3
		},
		maxScale: {
			type: Number,
			default: 4
		},
		canScale: {
			type: Boolean,
			default: true
		},
		noTop: {
			type: Boolean,
			default: false
		},
		quality: {
			type: Number,
			default: 0.9
		},	
		index: {
			type: Number,
		}
	}
}
