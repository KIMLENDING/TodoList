from datetime import datetime

# 주어진 타임스탬프 값을 변수에 저장
timestamps = {
    "from": 1726671600000,
    "to": 1726757940000
}

# 밀리초 타임스탬프를 변환하여 읽을 수 있는 날짜로 변환
from_time = datetime.fromtimestamp(timestamps["from"] / 1000)
to_time = datetime.fromtimestamp(timestamps["to"] / 1000)

print(from_time, to_time)