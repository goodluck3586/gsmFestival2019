// 학생 개인별 외출 데이터 선택: 체크박스 하나만 선택되게 하는 함수
function oneCheckbox(selectedCheckBox){
    if(selectedCheckBox.checked){
        var obj = document.getElementsByName("gooutListCheckbox");
        for(var i=0; i<obj.length; i++){
            if(obj[i] != selectedCheckBox){
                obj[i].checked = false;
            }
        }
        document.getElementById("deleteBtn").setAttribute('href', '/goout/delete/'+selectedCheckBox.value);
        document.getElementById("updateBtn").setAttribute('href', '/goout/update/'+selectedCheckBox.value);
    }else{
        document.getElementById("deleteBtn").setAttribute('href', '#');
        document.getElementById("updateBtn").setAttribute('href', '#');
    }
}

// 교사가 학생 외출 데이터 선택: 체크박스 하나만 선택되게 하는 함수
function oneCheckbox2(selectedCheckBox){
    if(selectedCheckBox.checked){
        var obj = document.getElementsByName("gooutListCheckbox");
        for(var i=0; i<obj.length; i++){
            if(obj[i] != selectedCheckBox){
                obj[i].checked = false;
            }
        }
        document.getElementById("allowBtn").setAttribute('href', '/teacher/allow/'+selectedCheckBox.value);
        document.getElementById("refuseBtn").setAttribute('href', '/teacher/refuse/'+selectedCheckBox.value);
    }else{
        document.getElementById("allowBtn").setAttribute('href', '#');
        document.getElementById("refuseBtn").setAttribute('href', '#');
    }
}