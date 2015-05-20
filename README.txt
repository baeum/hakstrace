npm install -g bower
npm install -g grunt-cli
npm install -g less
npm install -g node-gyp

npm install
bower install <-- 걍 bower 는 일단 쓰지 말자.

bower install nestable=git://github.com/RamonSmit/Nestable.git#* --save

http://jvectormap.com/js/jquery-jvectormap-us-aea-en.js 다운 받아서 lib/bower-jvectormap/jquery-jvectormap-us-aea-en.js  로 복사

이건 지역별로 맵을 다 받아야되나보네



jquery.sparkline.js 이거 좀 이상함 일단 따로 받아서 넣었음.
fullcalendar 는 dist 버전이 없어서 일단 dist 없이 넣었는데 좀 구린듯.

bootstrap-chosen 에서 css 파일 less 생성이 쉽지 않네. 걍 css 구해다 넣었음
nestable 저거는 옛날 주소는 망한듯. 새걸로 바꿈
lib/nggrid/ng-grid.bootstrap.css 이것도 걍 복사해서 넣었음. 생성해서 만든 듯 한데
lib/angular-ui-grid/ui-grid.bootstrap.css 이것도 걍 복사해서 넣었음. 생성해서 만든 듯 한데
lib/bootstrap-slider/bootstap-slider.css 이것도 걍 복사
lib/venturocket-angular-slider/build/angular-slider.css 이것도 걍 복사

// 초기데이터
db.userauths.insert({_id:"A", code:"A", name:"Administrator", order: 1})
db.userauths.insert({_id:"M", code:"M", name:"Manager", order: 2})
db.userauths.insert({_id:"U", code:"U", name:"User", order: 3})


// hakstrace script
public/errortest/hakstrace.js
이거 열어서 그대로 복붙 저장
