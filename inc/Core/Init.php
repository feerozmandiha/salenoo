<?php
/**
 * Init.php
 *
 * کلاس مرکزی راه‌انداز سیستم.
 * تمام ماژول‌های اجراشونده (services) باید اینجا ثبت شوند.
 */

namespace Salnama_Theme\Inc\Core;

class Init {

    /**
     * لیست سرویس‌هایی که باید اجرا شوند
     *
     * هر سرویس باید متد run() داشته باشد.
     *
     * @var array<string>
     */
    private array $services = [
        'Salnama_Theme\Inc\Core\AssetsLoader',   // در مرحله بعد اضافه می‌شود
        'Salnama_Theme\Inc\Core\AnimationController', // ✅ اضافه شد
        'Salnama_Theme\Inc\Blocks\AnimationAttributes',
        'Salnama_Theme\Inc\Blocks\AnimationInspector',
        // 'Salnama_Theme\Inc\Core\WooCommerceSetup',
        // 'Salnama_Theme\Inc\Core\GsapEngine',
    ];

    public function __construct() {
        $this->run_services();
    }

    private function run_services(): void {
        foreach ( $this->services as $service_class ) {
            if ( class_exists( $service_class ) ) {
                $service = new $service_class();
                if ( method_exists( $service, 'run' ) ) {
                    $service->run();
                }
            }
        }
    }
}