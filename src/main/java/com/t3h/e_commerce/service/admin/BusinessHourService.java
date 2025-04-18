package com.t3h.e_commerce.service.admin;

import com.t3h.e_commerce.dto.adminResponse.BusinessHourRequest;
import com.t3h.e_commerce.entity.BusinessHour;
import com.t3h.e_commerce.entity.SystemSetting;
import com.t3h.e_commerce.repository.BusinessHourRepository;
import com.t3h.e_commerce.repository.SystemSettingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BusinessHourService {
    private final BusinessHourRepository businessHourRepository;
    private final SystemSettingRepository systemSettingRepository;

    public void setBusinessHours(List<BusinessHourRequest> requests) {
        businessHourRepository.deleteAll();
        List<BusinessHour> businessHours = requests.stream()
                .map(req -> {
                    BusinessHour bh = new BusinessHour();
                    bh.setDayOfWeek(req.getDayOfWeek());
                    bh.setOpenTime(req.getOpenTime());
                    bh.setCloseTime(req.getCloseTime());
                    return bh;
                }).collect(Collectors.toList());

        businessHourRepository.saveAll(businessHours);
    }

    public void toggleTemporaryClosure(boolean isClosed) {
        SystemSetting setting = systemSettingRepository.findByKey("isTemporarilyClosed")
                .orElse(new SystemSetting());
        setting.setKey("isTemporarilyClosed");
        setting.setValue(String.valueOf(isClosed));
        systemSettingRepository.save(setting);
    }

    public boolean isTemporarilyClosed() {
        return systemSettingRepository.findByKey("isTemporarilyClosed")
                .map(setting -> Boolean.parseBoolean(setting.getValue()))
                .orElse(false);
    }

    public boolean isRestaurantOpen() {
        boolean isClosed = isTemporarilyClosed();
        if (isClosed) return false;

        LocalTime now = LocalTime.now();
        DayOfWeek today = LocalDate.now().getDayOfWeek();
        return businessHourRepository.findByDayOfWeek(today)
                .map(hour -> now.isAfter(hour.getOpenTime()) && now.isBefore(hour.getCloseTime()))
                .orElse(false);
    }

    public LocalTime getNextOpeningTime() {
        DayOfWeek today = LocalDate.now().getDayOfWeek();
        LocalTime now = LocalTime.now();

        // Tìm ngày tiếp theo mà cửa hàng mở cửa
        for (int i = 1; i <= 7; i++) {
            DayOfWeek nextDay = today.plus(i);
            Optional<BusinessHour> businessHour = businessHourRepository.findByDayOfWeek(nextDay);
            if (businessHour.isPresent()) {
                return businessHour.get().getOpenTime();
            }
        }

        return LocalTime.of(7, 0); // Mặc định là 7:00 AM nếu không tìm thấy
    }
}

