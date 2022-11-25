# 올코믹스

## 개발

```shell
# installation
$ npm ci
# run app
$ npm start
# open browser http://localhost:4200/
```

## 배포

### github
- `develop`, `master` 브랜치에 commit시 자동으로 배포
  - develop => stage
  - master => prod
- .github/workflows 폴더 내 yml 참고

### local

```shell script
# set AWS credential
$ aws configure --profile comics 
# deploy to stage
$ npm run deploy.stage
# deploy to prod
$ npm run deploy.prod
```
