<template>
  <view class="article-container">
    <text class="article-title">{{ article.title }}</text>
    <view class="article-meta">
      <text class="article-author">作者：{{ article.author }}</text>
      <text class="article-quote">引用：{{ article.quote }}</text>
      <text class="article-source">
        来源：
        <text class="article-link" @tap="openSource">{{ article.source }}</text>
      </text>
    </view>
    <image
      v-if="article.image"
      class="article-image"
      :src="article.image"
      mode="widthFix"
    />
    <video
      v-if="article.video"
      class="article-video"
      :src="article.video"
      controls
    />
    <view class="article-content" v-html="article.content"></view>
    <view v-if="article.links && article.links.length" class="article-links">
      <text>相关链接：</text>
      <view v-for="(link, idx) in article.links" :key="idx">
        <text class="article-link" @tap="openLink(link.url)">{{ link.title }}</text>
      </view>
    </view>
    <view v-if="!article.title" class="empty-tip">暂无文章内容</view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      article: {
        title: '示例文章标题',
        author: '张三',
        quote: '“学而不思则罔，思而不学则殆。”',
        source: 'https://www.example.com/source',
        image: '@/static/sample_img.jpg',
        video: '', // 如有视频则填写视频链接
        content: `<p>这是文章的正文内容，可以包含<strong>加粗</strong>、<em>斜体</em>、<a href="https://www.example.com" target="_blank">超链接</a>等富文本元素。</p>`,
        links: [
          { title: '相关链接1', url: 'https://www.example.com/link1' },
          { title: '相关链接2', url: 'https://www.example.com/link2' }
        ]
      }
    }
  },
  methods: {
    openSource() {
      this.openLink(this.article.source)
    },
    openLink(url) {
      // #ifdef H5
      window.open(url, '_blank')
      // #endif
      // #ifdef APP-PLUS
      plus.runtime.openURL(url)
      // #endif
    }
  }
}
</script>

<style scoped>
.article-container {
  padding: 32rpx;
  background: #fff;
}
.article-title {
  font-size: 40rpx;
  font-weight: bold;
  margin-bottom: 18rpx;
  display: block;
}
.article-meta {
  color: #888;
  font-size: 26rpx;
  margin-bottom: 18rpx;
}
.article-author,
.article-quote,
.article-source {
  display: block;
  margin-bottom: 6rpx;
}
.article-link {
  color: #409eff;
  text-decoration: underline;
  margin-left: 8rpx;
}
.article-image {
  width: 100%;
  margin: 18rpx 0;
  border-radius: 8rpx;
}
.article-video {
  width: 100%;
  margin: 18rpx 0;
  border-radius: 8rpx;
}
.article-content {
  font-size: 30rpx;
  color: #222;
  line-height: 1.8;
  margin-bottom: 18rpx;
}
.article-links {
  margin-top: 18rpx;
  font-size: 28rpx;
}
.empty-tip {
  text-align: center;
  color: #bbb;
  margin-top: 80rpx;
  font-size: 30rpx;
}
</style>
