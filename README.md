# Hướng Deploy dự án 

## Cách 1: Sử dụng Dockerfile

1. Di chuyển vào thư mục chứa source code của dự án
``` bash
cd ./Nhom08 # thay đổi tên thư mục nếu cần
```

2. Kiẻm tra xem thiết bị của bạn đã cài đặt Docker và docker compose chưa, nếu chưa có thì phải cài đặt hoặc sử dụng cách 2
``` bash
docker -v
docker-compose -v
```

3. Chạy lệnh sau để chạy docker-compose
``` bash
bash build-docker.sh # linux or macos
```

4. Truy cập vào địa chỉ `http://localhost:5174` để xem kết quả và `http://localhost:3000` để xem doc api

5. Xoá docker container
``` bash
bash remove-docker.sh # linux or macos
```


## Cách 2: Cài đặt thủ công
### Backend
1. Di chuyển vào thư mục chứa source code của backend
``` bash
cd ./backend
```

2. Cài đặt các thư viện cần thiết
``` bash
npm install
```

3. Chạy dự án
``` bash
npm run start
```

### Frontend
1. Di chuyển vào thư mục chứa source code của frontend
``` bash
cd ./frontend
```

2. Cài đặt các thư viện cần thiết
``` bash
npm install
```

3. Chạy dự án
``` bash
npm run start
```

